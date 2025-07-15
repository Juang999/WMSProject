const {InventoryService, PuttingService, OpnameService, ProductService} = require('../Services/ServiceContainer');
const {sequelize, Sequelize} = require('../../models');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');
const {Authentication} = require('../../helper/helper');

class RegisterController {
    move = (req, res) => {
        let {partnumber, sublocation_from, sublocation_to, uniq} = req.body;

        sequelize.transaction(async t => {
            let parsedUniq = JSON.parse(uniq);
            let [getSerial, originSublocation, destinationSublocation, getDataProduct] = await Promise.all([
                OpnameService.getDataSerial(sublocation_from, partnumber, parsedUniq),
                InventoryService.findSublocation(sublocation_from),
                InventoryService.findSublocation(sublocation_to),
                ProductService.findProductByPartnumber(partnumber)
            ]);

            if (getSerial.length == 0) {
                return this.returnResponse(300, 'failed', 'serial not registered', null, null)
            }

            let dataLocation = await InventoryService.findDataLocation(destinationSublocation.dataValues.location_id, partnumber);

            if (!dataLocation) {
                dataLocation = await InventoryService.assignProductIntoLocation(destinationSublocation.dataValues.location_id, getDataProduct.dataValues.pt_id);
            }

            let uuidSerial = getSerial.map(({dataValues: singularSerial}) => singularSerial.invcd_oid);
            let dataHistorySerial = getSerial.map(({dataValues: data}) => {
                return {
                    invcdh_oid: uuidv4(),
                    invcdh_dom_id: data.invcd_dom_id,
                    invcdh_en_id: data.invcd_en_id,
                    invcdh_pt_id: data.invcd_pt_id,
                    invcdh_loc_from_id: originSublocation.dataValues.location_id,
                    invcdh_loc_to_id: destinationSublocation.dataValues.location_id,
                    invcdh_locs_from_id: sublocation_from,
                    invcdh_locs_to_id: sublocation_to,
                    invcdh_qrbarcode: data.invcd_qrbarcode,
                    invcdh_status: 'moved!',
                    invcdh_remarks: 'moved',
                    invcdh_created_by: Authentication.user().usernama,
                    invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
                }
            })

            await Promise.all([
                OpnameService.moveSerial(
                    uuidSerial, 
                    Sequelize.literal(`CASE WHEN invcd_invc_oid IS NULL THEN NULL ELSE '${dataLocation.dataValues.invc_oid}' END`), 
                    destinationSublocation.dataValues.location_id, 
                    sublocation_to, 
                    Authentication.user().usernama, 
                    t
                ),
                OpnameService.createHistory(dataHistorySerial, t)
            ])

            return this.returnResponse(200, 'success', 'ok', null, null)
        })
        .then(result => {
            res.status(result.statusCode)
                .json(result.json)
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    getDataProduct = (req, res) => {
        let locsId = req.params.sublocation_id;

        InventoryService.getProductAndSerialBySublocation(locsId)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    getHistoryByStatus = (req, res) => {
        let date = (req.query.date) ? moment(req.query.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
        let status = (req.params.status) ? req.params.status : 'moved';

        InventoryService.getHistoryPerStatus(date, status)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    returnResponse = (statusCode, status, message, data, error) => {
        return {statusCode, json: {status, message, data, error}}
    }
}

module.exports = new RegisterController();
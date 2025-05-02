const {InventoryService, PuttingService, OpnameService} = require('../Services/ServiceContainer');
const {sequelize} = require('../../models');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');

class RegisterController {
    move = (req, res) => {
        let {partnumber, sublocation_from, sublocation_to, uniq} = req.body;

        sequelize.transaction(async t => {
            let parsedUniq = JSON.parse(uniq);
            let [getSerial, originSublocation, destinationSublocation] = await Promise.all([
                OpnameService.getDataSerial(sublocation_from, partnumber, parsedUniq),
                InventoryService.findSublocation(sublocation_from),
                InventoryService.findSublocation(sublocation_to)
            ]);

            if (getSerial.length == 0) {
                return this.returnResponse(300, 'failed', 'serial not registered', null, null)
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
                    invcdh_created_by: 'system',
                    invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
                }
            })

            await Promise.all([
                OpnameService.moveSerial(uuidSerial, destinationSublocation.dataValues.location_id, sublocation_to, t),
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

    returnResponse = (statusCode, status, message, data, error) => {
        return {statusCode, json: {status, message, data, error}}
    }
}

module.exports = new RegisterController();
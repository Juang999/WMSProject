const {sequelize} = require('../../models');
const {error: errorLog} = require('../../helper/Logging');
const {
    GetDescService,
    LocationService, ProductService, 
    InventoryService, OpnameService
} = require('../Services/ServiceContainer');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');
const {Authentication} = require('../../helper/helper')

class PuttingController {
    index = (req, res) => {
        let uniq = (req.query.uniq) ? req.query.uniq : '';

        Promise.all([InventoryService.getSerialSublocation(req.params.sublocation_id, uniq), LocationService.findSublocation(req.params.sublocation_id)])
        .then(([resultScan, dataSublocation]) => {
            resultScan.maximum_capacity = (dataSublocation != null) ? dataSublocation.dataValues.capacity : 0

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: resultScan,
                    error: null
                })
        })
        .catch(err => {
            errorLog('GET DATA SERIAL BY SUBLOCATION', err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    store = async (req, res) => {
        sequelize.transaction(async t => {
            let dataProduct = await ProductService.findProductByPartnumber(req.body.partnumber);

            if (dataProduct == null) {
                let dataPn = await GetDescService.findOldProductBySerialNumber(req.body.partnumber);
                dataProduct = (dataPn == null) ? null : await ProductService.findProductByPartnumber(dataPn.dataValues.pn);
            }

            if (dataProduct == null) {
                return this.returnResponse(404, 'not found', `product not found!: partnumber: ${req.body.partnumber}`, null, null)
            }

            let [dataSerial, dataCapSublocation, dataTotalQtySublocation, dataPartnumber] = await Promise.all([
                OpnameService.funcFindSerialNumber(req.body.uniq, dataProduct.dataValues.partnumber, t),
                LocationService.findSublocation(req.body.sublocation_id),
                InventoryService.countSerialSublocation(req.body.sublocation_id),
                InventoryService.getPartnumberBySerial(req.body.uniq)
            ]);

            if (dataPartnumber.length != 0) {
                let response = this.checkPartnumberSerial(dataPartnumber, req.body.uniq, dataProduct.dataValues.partnumber)
                
                if (response != undefined) {
                    return response;
                }
            }

            if (dataCapSublocation == null) {
                return this.returnResponse(404, 'not found', `sublocation not found!: sublocation_id: ${req.body.sublocation_id}`, null, null)
            }

            if (parseInt(req.body.entity_id) != dataProduct.dataValues.pt_en_id) {
                return this.returnResponse(300, 'rejected', 'cannot input article with another entity!', null, null)
            }

            if (dataCapSublocation.dataValues.capacity != null && dataTotalQtySublocation >= dataCapSublocation.dataValues.capacity) {
                return this.returnResponse(300, 'rejected', 'sublocation already full', null, null)
            }

            if (dataSerial && dataSerial.dataValues.uniq != null && dataSerial.dataValues.product_code != req.body.partnumber) {
                return this.returnResponse(300, 'rejected', `serial has been registered with another product | partnumber: ${req.body.partnumber}`, null, null)
            }

            if (dataSerial && dataSerial.dataValues.invcd_locs_id != null) {
                if (parseInt(dataSerial.dataValues.invcd_locs_id) != parseInt(req.body.sublocation_id)) {
                    return this.returnResponse(300, 'rejected', 'serial has been registered into another sublocation', null, null);
                }
            }

            if (!dataSerial) {
                await Promise.all([
                    InventoryService.createSerialNumber({
                        en_id: req.body.entity_id,
                        pt_id: dataProduct.dataValues.pt_id,
                        qrbarcode: req.body.uniq,
                        loc_id: req.body.location_id,
                        locs_id: req.body.sublocation_id
                    }, Authentication.user().usernama, t),
                    InventoryService.createHistory([
                        {
                            invcdh_oid: uuidv4(),
                            invcdh_dom_id: 1,
                            invcdh_en_id: dataProduct.dataValues.pt_en_id,
                            invcdh_pt_id: dataProduct.dataValues.pt_id,
                            invcdh_loc_to_id: req.body.location_id,
                            invcdh_locs_to_id: req.body.sublocation_id,
                            invcdh_qrbarcode: req.body.uniq,
                            invcdh_status: 'registered!',
                            invcdh_remarks: 'registered',
                            invcdh_created_by: Authentication.user().usernama,
                            invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
                        }
                    ], t)
                ])
            } else {
                await Promise.all([
                    InventoryService.updateSerial(
                    dataSerial.dataValues.invcd_oid, 
                    {
                        location_id: req.body.location_id,
                        sublocation_id: req.body.sublocation_id,
                        serial_number: req.body.uniq
                    }, Authentication.user().usernama, t),
                    InventoryService.createHistory([
                        {
                            invcdh_oid: uuidv4(),
                            invcdh_dom_id: 1,
                            invcdh_en_id: dataProduct.dataValues.pt_en_id,
                            invcdh_pt_id: dataProduct.dataValues.pt_id,
                            invcdh_loc_to_id: req.body.location_id,
                            invcdh_locs_to_id: req.body.sublocation_id,
                            invcdh_qrbarcode: req.body.uniq,
                            invcdh_status: 'registered!',
                            invcdh_remarks: 'registered',
                            invcdh_created_by: Authentication.user().usernama,
                            invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
                        }
                    ], t)
                ])
            }

            return this.returnResponse(200, 'success', 'ok', null, null)
        })
        .then(result => {
            res.status(result.statusCode)
                .json(result.json)
        })
        .catch(err => {
            errorLog('STORE DATA SERIAL INTO SUBLOCATION', err.message)

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
        Promise.all([
            LocationService.findSublocation(req.params.sublocation_id), 
            InventoryService.getSerialProduct(req.params.sublocation_id), 
            InventoryService.getSerialSublocation(req.params.sublocation_id)
        ])
        .then(([dataSublocation, dataProduct, dataScanned]) => {
            let result;

            if (dataSublocation != null) {
                dataSublocation.dataValues.scanned = dataScanned['count']

                result = {data_sublocation: dataSublocation, data_product: dataProduct};
            } else {
                result = {data_sublocation: null, data_product: null}
            }

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        })
        .catch(err => {
            errorLog('GET DATA PRODUCT IN SUBLOCATION', err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    getDataSerial = (req, res) => {
        Promise.all([
            InventoryService.getSerialPartnumber(req.params.sublocation_id, req.params.product_id), 
            LocationService.findSublocation(req.params.sublocation_id)
        ]).then(([resultScan, resultSublocation]) => {
            resultScan.sublocation_name = (resultSublocation) ? resultSublocation.dataValues.sublocation_name : '-';
            resultScan.location_name = (resultSublocation) ? resultSublocation.dataValues.location_name : '-';
            resultScan.maximum_capacity = (resultSublocation) ? resultSublocation.dataValues.capacity : 0;

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: resultScan,
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

    deleteDataSerial = async (req, res) => {
        sequelize.transaction(async t => {
            let dataSerial = await InventoryService.getSerialByOid(req.params.invcd_oid);
            let historySerial = {
                invcdh_oid: uuidv4(),
                invcdh_dom_id: dataSerial.dataValues.invcd_dom_id,
                invcdh_en_id: dataSerial.dataValues.invcd_en_id,
                invcdh_pt_id: dataSerial.dataValues.invcd_pt_id,
                invcdh_loc_from_id: dataSerial.dataValues.invcd_loc_id,
                invcdh_locs_from_id: dataSerial.dataValues.invcd_locs_id,
                invcdh_qrbarcode: dataSerial.dataValues.invcd_qrbarcode,
                invcdh_status: 'deleted!',
                invcdh_remarks: 'deleted',
                invcdh_created_by: Authentication.user().usernama,
                invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            await Promise.all([
                InventoryService.destroySerial(req.params.invcd_oid, t),
                InventoryService.createHistory([historySerial], t)
            ])

            return this.returnResponse(200, 'success', 'deleted', true, 0)
        })
        .then(result => {
            res.status(result.statusCode)
                .json(result.json)
        })
        .catch(err => {
            errorLog(`DELETE SERIAL`, err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    historySerial = async (req, res) => {
        InventoryService.getHistorySerial()
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

    checkPartnumberSerial = (dataPartnumber, uniq, partnumberRequest) => {
        for (const {dataValues: dataSingular} of dataPartnumber) {
            if (dataSingular.invcd_qrbarcode != null) {
                return this.compareSerial(dataSingular.invcd_qrbarcode, uniq)
            } else if (dataSingular.invcd_alias_qrbarcode == uniq && dataSingular.pt_code != partnumberRequest) {
                return this.returnResponse(300, 'rejected', `alias uniq already registered with another partnumber!`, null, null)
            }
        }
    }

    compareSerial = (serialDatabase, serialRequest) => {
        if (serialDatabase != serialRequest) {
            return {statusCode: 300, json: {status: 'rejected', message: `uniq already registered with another partnumber!`, data: null, error: null}}
        }
    }

    returnResponse = (statusCode, status, message, data, error) => {
        return {statusCode, json: {status, message, data, error}}
    }
}

module.exports = new PuttingController();
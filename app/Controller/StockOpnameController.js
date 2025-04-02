const Auth = require('../../helper/auth');
const {sequelize} = require('../../models');
const {
    LocationService,
    InventoryService, UserService, 
    ProductService, OpnameService
} = require('../Services/ServiceContainer');
const {info, error: errorLog} = require('../../helper/Logging');

class StockOpnameController {
    index = (req, res) => {
        OpnameService.retrieveDataOpname()
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
            errorLog(`RETRIEVE DATA OPNAME`, err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    detail = async (req, res) => {
        try {
            let dataDetail = await OpnameService.retrieveDetailOpname(req.params.opname_code);

            if (!dataDetail) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'not found',
                        data: null,
                        error: 'not found'
                    });

                return;
            }

            let idLocations = dataDetail.dataValues.detail_opname.map(({dataValues}) => {
                return dataValues.location_id;
            })

            dataDetail.locations = await LocationService.findLocations(idLocations);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: dataDetail,
                    error: null
                })
        } catch (error) {
            await errorLog('RETRIEVE DETAIL OPNAME', `PARAMETER: ${req.params.opname_code} | error: ${error.message}`)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    store = (req, res) => {
        let {som_oid, partnumber, uniq, location_id} = req.body;

        sequelize.transaction(async t => {
            let [
                dataProduct, 
                serialNumber,
                detailOpname
            ] = await Promise.all([
                ProductService.findProductByPartnumber(partnumber), 
                OpnameService.findSerialNumber(uniq, partnumber, t),
                OpnameService.findDetailOpname(som_oid, partnumber, location_id)
            ])

            if (!serialNumber) {
                await Promise.all([
                    OpnameService.addQtyOpname(detailOpname.dataValues.somd_oid, t),
                    OpnameService.createSerialNumber(uniq, dataProduct.dataValues, location_id, t),
                    OpnameService.createDetailOpname(detailOpname.dataValues.somd_oid, dataProduct.dataValues.pt_id, location_id, uniq, t)
                ])

                return {
                    statusCode: 200,
                    response: {
                        status: 'success',
                        message: 'serial created!',
                        data: null,
                        error: null
                    }
                }
            } else if (serialNumber.dataValues.uniq == null) {
                await Promise.all([
                    OpnameService.updateSerialNumber(uniq, partnumber, location_id, t),
                    OpnameService.createDetailOpname(detailOpname.dataValues.somd_oid, dataProduct.dataValues.pt_id, location_id, uniq, t)
                ])

                return {
                    statusCode: 200,
                    response: {
                        status: 'success',
                        message: 'serial created!',
                        data: null,
                        error: null
                    }
                }
            } else {
                return {
                    statusCode: 300,
                    response: {
                        status: 'failed',
                        message: 'serial already exist!',
                        data: null,
                        error: null
                    }
                }
            }
        })
        .then(result => {
            res.status(result.statusCode)
                .json(result.response)
        })
        .catch(err => {
            errorLog(`STORE SERIAL NUMBER`, err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error!',
                    data: null,
                    error: err.message
                })
        })
    }

    serialOpname = (req, res) => {
        OpnameService.retrieveSerialOpname(req.params.somd_oid)
        .then(result => {
            res.status((result.length != 0) ? 200 : 404)
                .json({
                    status: (result.length != 0) ? 'success' : 'not found!',
                    message: (result.length != 0) ? 'ok' : 'not found',
                    data: (result.length != 0) ? result : null,
                    error: (result.length != 0) ? null : 'not found'
                })
        })
        .catch(err => {
            errorLog('RETRIEVE SERIAL OPNAME', err.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }
}

module.exports = new StockOpnameController();
const Auth = require('../../helper/auth');
const {sequelize} = require('../../models');
const {
    LocationService,
    InventoryService, UserService, 
    ProductService, OpnameService
} = require('../Services/ServiceContainer');
const {info, error: errorLog, errorMinor} = require('../../helper/Logging');

class StockOpnameController {
    getLocationOpname = (req, res) => {
        let search = (req.query.search) ? req.query.search : '';

        LocationService.getSimpleDataLocation(req.params.entity_id, search)
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
            errorLog('GET LOCATION OPNAME', err.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }
    
    getProductOpname = (req, res) => {
        let location_id = (req.params.location_id == 0 || isNaN(parseInt(req.params.location_id))) ? null : req.params.location_id;
        let search = (req.query.search) ? req.query.search : '';

        ProductService.getSimpleDataProduct(req.params.entity_id, location_id, search)
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
            errorLog('GET PRODUCT OPNAME', err.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    getSerialOpname = (req, res) => {
        let location_id = (req.params.location_id == 0 || isNaN(parseInt(req.params.location_id))) ? null : req.params.location_id;
        let product_id = (req.params.product_id == 0 || isNaN(parseInt(req.params.product_id))) ? null : req.params.product_id;

        OpnameService.retrieveSerial(location_id, product_id)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                });
        })
        .catch(err => {
            errorLog('GET SERIAL OPNAME', err.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                });
        })
    }

    getInventoryMaster = (req, res) => {
        let searchLocation = (req.query.location) ? req.query.location : '';
        let searchProduct = (req.query.product) ? req.query.product : '';

        OpnameService.retrieveInventoryMaster(searchLocation, searchProduct)
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
            errorLog('GET INVENTORY MASTER', err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

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

            dataDetail.dataValues.locations = await LocationService.findLocations(idLocations);

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
                detailOpname,
                serialOpname
            ] = await Promise.all([
                ProductService.findProductByPartnumber(partnumber), 
                OpnameService.findSerialNumber(uniq, partnumber, t),
                OpnameService.findDetailOpname(som_oid, partnumber, location_id),
                OpnameService.findSerialOpname(location_id, partnumber, uniq),
            ])

            if (detailOpname == null || dataProduct == null) {
                errorMinor(`INPUT OPNAME`, `DETAIL OPNAME or DATA PRODUCT not found! | partnumber: ${partnumber}`)

                return this.returnResponse(200, 'rejected', 'rejected', null, null)
            }

            if (!serialNumber) {
                if (serialOpname) {
                    await Promise.all([
                        OpnameService.addQtyOpname(detailOpname.dataValues.somd_oid, t),
                        OpnameService.createSerialNumber(uniq, dataProduct.dataValues, location_id, t),
                        OpnameService.updateSerialOpname(serialOpname.dataValues.somdd_oid, t)
                    ])
                } else {
                    await Promise.all([
                        OpnameService.addQtyOpname(detailOpname.dataValues.somd_oid, t),
                        OpnameService.createSerialNumber(uniq, dataProduct.dataValues, location_id, t),
                        OpnameService.createDetailOpname(detailOpname.dataValues.somd_oid, dataProduct.dataValues.pt_id, location_id, uniq, t)
                    ])
                }

                return this.returnResponse(200, 'success', 'serial created', null, null)
            } else if (serialNumber.dataValues.uniq == null || (serialNumber.dataValues.uniq == uniq && serialNumber.dataValues.product_code == partnumber)) {
                if (serialOpname) {
                    if (serialOpname.dataValues.qty == 0) {
                        await OpnameService.addQtyOpname(detailOpname.dataValues.somd_oid, t);
                    }

                    await Promise.all([
                        OpnameService.updateSerialNumber(uniq, partnumber, location_id, t),
                        OpnameService.updateSerialOpname(serialOpname.dataValues.somdd_oid, t)
                    ])
                } else {
                    await Promise.all([
                        OpnameService.addQtyOpname(detailOpname.dataValues.somd_oid, t),
                        OpnameService.updateSerialNumber(uniq, partnumber, location_id, t),
                        OpnameService.createDetailOpname(detailOpname.dataValues.somd_oid, dataProduct.dataValues.pt_id, location_id, uniq, t)
                    ])
                }

                return this.returnResponse(200, 'success', 'serial created', null, null)
            } else if ((serialNumber.dataValues.uniq == uniq && serialNumber.dataValues.product_code != partnumber)) {
                return this.returnResponse(300, 'failed', 'serial already used with another partnumber', null, null)
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

    deleteSerial = (req, res) => {
        let somddOid = req.params.somdd_oid;

        sequelize.transaction(async t => {
            await Promise.all([
                OpnameService.subtractQtyOpname(somddOid, t),
                OpnameService.deleteSerialOpname(somddOid, t)
            ])

            return this.returnResponse(200, 'success', 'deleted!', 1, null)
        })
        .then(result => {
            res.status(result.statusCode)
                .json(result.response)
        })
        .catch(err => {
            errorLog('DELETE SERIAL WHILE STOCK OPNAME', err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    messag: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    returnResponse = (statusCode, status, message, data, error) => {
        return {
            statusCode,
            response: {status, message, data, error}
        }
    }
}

module.exports = new StockOpnameController();
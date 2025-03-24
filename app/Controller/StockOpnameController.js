const Auth = require('../../helper/auth');
const {sequelize} = require('../../models');
const {
    InventoryService, UserService, 
    ProductService, OpnameService
} = require('../Services/ServiceContainer');

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
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    detail = (req, res) => {
        OpnameService.retrieveDetailOpname(req.params.opname_code)
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

    store = (req, res) => {
        let {somd_oid, partnumber, uniq, location_id} = req.body;
        
        sequelize.transaction(async t => {
            let [
                dataProduct, 
                serialNumber
            ] = await Promise.all([
                ProductService.findProductByPartnumber(partnumber), 
                OpnameService.findSerialNumber(uniq, partnumber, t)
            ])

            if (!serialNumber) {
                await Promise.all([
                    OpnameService.addQtyOpname(somd_oid, t),
                    OpnameService.createSerialNumber(uniq, dataProduct.dataValues, location_id, t),
                    OpnameService.createDetailOpname(somd_oid, dataProduct.dataValues.pt_id, location_id, uniq, t)
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
                    OpnameService.createDetailOpname(somd_oid, dataProduct.dataValues.pt_id, location_id, uniq, t)
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
}

module.exports = new StockOpnameController();
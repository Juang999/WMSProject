const {PuttingService, ProductService, OpnameService} = require('../Services/ServiceContainer');
const {error: errorLog} = require('../../helper/Logging');
const {sequelize} = require('../../models');

class PuttingController {
    index = (req, res) => {
        PuttingService.getDataSerialBySubLocation(req.params.sublocation_id)
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
            const [dataProduct, dataSerial, dataCapSublocation, dataTotalQtySublocation] = await Promise.all([
                ProductService.findProductByPartnumber(req.body.partnumber),
                OpnameService.findSerialNumber(req.body.uniq, req.body.partnumber, t),
                PuttingService.getSpesificSublocation(req.body.sublocation_id),
                PuttingService.getTotalSerialInSublocation(req.body.sublocation_id),
            ]);

            if (dataProduct == null) {
                return this.returnResponse(404, 'not found', `product not found!: partnumber: ${req.body.partnumber}`, null, null)
            }

            if (dataCapSublocation == null) {
                return this.returnResponse(404, 'not found', `sublocation not found!: sublocation_id: ${req.body.sublocation_id}`, null, null)
            }

            if (parseInt(req.body.entity_id) != dataProduct.dataValues.pt_en_id) {
                return this.returnResponse(300, 'rejected', 'cannot input article with another entity!', null, null)
            }

            if (dataTotalQtySublocation >= dataCapSublocation.dataValues.capacity) {
                return this.returnResponse(300, 'rejected', 'sublocation already full', null, null)
            }

            if (dataSerial && dataSerial.dataValues.uniq != null && dataSerial.dataValues.product_code != req.body.partnumber) {
                return this.returnResponse(300, 'rejected', `serial has been registered with another product | partnumber: ${req.body.partnumber}`, null, null)
            }

            if (dataSerial) {
                await PuttingService.updateSerial(dataSerial.dataValues.invcd_oid, req.body.uniq, req.body.sublocation_id, t)
            } else {
                await PuttingService.putProductIntoSubLocation({
                    en_id: dataProduct.dataValues.pt_en_id,
                    pt_id: dataProduct.dataValues.pt_id,
                    qrbarcode: req.body.uniq,
                    loc_id: req.body.location_id,
                    locs_id: req.body.sublocation_id
                }, t);
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
            PuttingService.getSpesificSublocation(req.params.sublocation_id), 
            PuttingService.getProduct(req.params.sublocation_id), 
            PuttingService.getDataSerialBySubLocation(req.params.sublocation_id)
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
        PuttingService.getDataSerialPartnumber(req.params.sublocation_id, req.params.product_id)
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

    deleteDataSerial = (req, res) => {
        PuttingService.deleteSerial(req.params.invcd_oid)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'deleted!',
                    data: result,
                    error: null
                })
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
}

module.exports = new PuttingController();
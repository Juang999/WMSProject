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

            if (parseInt(req.body.entity_id) != dataProduct.dataValues.pt_en_id) {
                return this.returnResponse(300, 'rejected', 'cannot input article with another entity!', null, null)
            }

            if (dataTotalQtySublocation >= dataCapSublocation.dataValues.capacity) {
                return this.returnResponse(300, 'rejected', 'sublocation already full', null, null)
            }

            if (dataSerial) {
                return this.returnResponse(300, 'rejected', 'serial already exist', null, null)
            }

            await PuttingService.putProductIntoSubLocation({
                en_id: dataProduct.dataValues.pt_en_id,
                pt_id: dataProduct.dataValues.pt_id,
                qrbarcode: req.body.uniq,
                loc_id: req.body.location_id,
                locs_id: req.body.sublocation_id
            }, t);

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

    returnResponse = (statusCode, status, message, data, error) => {
        return {statusCode, json: {status, message, data, error}}
    }
}

module.exports = new PuttingController();
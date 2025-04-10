const {ShipmentService, LocationService} = require('../Services/ServiceContainer');
const {info, error: errorLog} = require('../../helper/Logging');

class SoShipmentController {
    detail = async (req, res) => {
        try {
            let dataShipment = await ShipmentService.getDetailShipment(req.params.shipment_code);

            if (dataShipment == undefined) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'not found',
                        data: null,
                        error: null
                    })

                return;
            }

            let idLocation = dataShipment.dataValues.detail_soship.map(({dataValues: detailShipment}) => detailShipment.location_id);
            dataShipment.dataValues.locations = await LocationService.findLocations(idLocation);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: dataShipment,
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SHIPMENT', error.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    shipSerial = (req, res) => {
        
    }

    detailSerial = async (req, res) => {
        ShipmentService.getDetailSerial(req.params.detail_shipment_oid)
        .then(result => {
            let code = (result != undefined) ? 200 : 404;
            let status = (result != undefined) ? 'succes' : 'not found';
            let message = (result != undefined) ? 'ok' : 'not found';
            let data = (result != undefined) ? result : null;

            res.status(code).json({status, message, data, error: null})
        })
        .catch(err => {
            errorLog('SHIPMENT DETAIL SERIAL', err.message)

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

module.exports = new SoShipmentController();
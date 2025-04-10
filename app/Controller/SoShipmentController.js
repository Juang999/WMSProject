const {ShipmentService, LocationService} = require('../Services/ServiceContainer');
const {info, error: errorLog} = require('../../helper/Logging');

class SoShipmentController {
    detail = async (req, res) => {
        try {
            let dataShipment = await ShipmentService.getDetailSerial(req.params.shipment_code);
            
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
}

module.exports = new SoShipmentController();
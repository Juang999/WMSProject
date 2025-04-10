const {ShipmentService} = require('../Services/ServiceContainer');

class SoShipmentController {
    detail = async (req, res) => {
        try {
            let dataShipment = await ShipmentService.getDetailSerial(req.params.shipment_code);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: dataShipment,
                    error: null
                })
        } catch (error) {
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
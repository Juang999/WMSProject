const { info, error: errorLog } = require('../../helper/Logging');
const { PartnerService } = require('../Services/ServiceContainer');

class PartnerController {
    getSalesPersonByEntity = async ( req, res ) => {
        try {
            let entityId = req.params.entity_id;
            let salesName = req.query.sales_name || '';

            let result = await PartnerService.retrieveSalesPersonByEntity( entityId, salesName );

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET SALES PERSON BY ENTITY', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    getCustomerByEntity = async ( req, res ) => {
        try {
            let entityId = req.params.entity_id;
            let customerName = req.query.customer_name || '';

            let result = await PartnerService.retrieveCustomerByEntity( entityId, customerName );

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog(`GET CUSTOMER NY ENTITY`, error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Interal Server Error'
                })
        }
    }
}

module.exports = new PartnerController();
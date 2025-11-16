const { ShipmentService, SalesOrderService } = require('../Services/ServiceContainer');
const { info, error: errorLog } = require('../../helper/Logging');
const moment = require('moment');

class SalesOrderShipmentController {
    getAllShipmentHeader = async ( req, res ) => {
        try {
            let sortingType = ['ASC', 'DESC'];

            let params = {
                conditions: {
                    start_date: (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD') : moment().startOf('weeks').format('YYYY-MM-DD'),
                    end_date: (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD') : moment().endOf('weeks').format('YYYY-MM-DD'),
                    shipment_code: (req.query.shipment_code) ? req.query.shipment_code : '',
                },
                sort: {
                    date_sort: (sortingType.find(item => item == req.query.date_sort)) ? req.query.date_sort : 'DESC',
                }
            }

            let result = await ShipmentService.retrieveHeaderShipment( params );

            return res.status(200).json({
                status: 'SUCCESS',
                message: 'Successfully retrieved shipment headers',
                data: result,
                error: null
            });
        } catch (error) {
            await errorLog('GET HEADER SALES ORDER SHIPMENT', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    getDetailShipment = async ( req, res ) => {
        try {
            let headerShipmentOid = req.params.header_shipment_oid;

            let [ data_detail, serial_number ] = await Promise.all([
                ShipmentService.retrieveDetailShipmentByOid( headerShipmentOid ),
                ShipmentService.retrieveSerialShipmentByOid( headerShipmentOid )
            ]);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: {data_detail, serial_number},
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SALES ORDER SHIPMENT', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    getAllDataSalesOrder = async ( req, res ) => {
        try {
            let entityId = req.params.entity_id;
            let search = req.query.saerch || '';
            let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD') : moment().startOf('months').format('YYYY-MM-DD');
            let endDate = (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD') : moment().endOf('months').format('YYYY-MM-DD');

            let result = await SalesOrderService.retrieveSalesOrderNumber(entityId, search, startDate, endDate);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET ALL DATA SALES ORDER', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error'
                })
        }
    }

    getDetailSalesOrderForShipment = async ( req, res ) => {
        try {
            let salesOrderOid = req.params.sales_order_oid;

            let result = await SalesOrderService.retrieveSalesOrderForShipment(salesOrderOid);
            result.dataValues.serial_number = await SalesOrderService.retrieveSerialNumberSalesOrder(salesOrderOid);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SALES ORDER FOR SHIPMENT', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error'
                })
        }
    }
}

module.exports = new SalesOrderShipmentController();
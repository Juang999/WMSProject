const { Router } = require('express');
const router = Router();
const { getAllShipmentHeader, getDetailShipment, getAllDataSalesOrder, getDetailSalesOrderForShipment, createShipment } = require('../app/Controller/SalesOrderShipmentController');
const authMiddleware = require('../app/Middleware/authenticate');
const { Requests } = require('../app/Kernel');

router.get('/all', [ authMiddleware ], getAllShipmentHeader);
router.get('/:header_shipment_oid/detail', [ authMiddleware ], getDetailShipment);
router.get('/:entity_id/all-sales-order', [ authMiddleware ], getAllDataSalesOrder);
router.get('/:sales_order_oid/detail-sales-order', [ authMiddleware ], getDetailSalesOrderForShipment);
router.post('/create-shipment', [ authMiddleware, Requests.SalesOrderShipment.CreateSalesOrderShipmentRequest ], createShipment);

module.exports = router;
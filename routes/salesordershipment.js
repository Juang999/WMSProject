const { Router } = require('express');
const router = Router();
const { getAllShipmentHeader, getDetailShipment, getAllDataSalesOrder, getDetailSalesOrderForShipment } = require('../app/Controller/SalesOrderShipmentController');
const authMiddleware = require('../app/Middleware/authenticate');

router.get('/all', [ authMiddleware ], getAllShipmentHeader);
router.get('/:entity_id/all-sales-order', [ authMiddleware ], getAllDataSalesOrder);
router.get('/:sales_order_oid/detail-sales-order', [ authMiddleware ], getDetailSalesOrderForShipment);
router.get('/:header_shipment_oid/detail', [ authMiddleware ], getDetailShipment);

module.exports = router;
const {Router} = require('express');
const router = Router();
const {detail, detailSalesOrder, shipSerial, detailSerial, findProductBySerial} = require('../app/Controller/SoShipmentController');

router.get('/:shipment_code/detail', detail);
router.post('/ship-serial', shipSerial);
router.get('/:detail_shipment_oid/serial', detailSerial);
router.get('/:sales_order_code/sales-order', detailSalesOrder);
router.get('/:serial/serial/detail', findProductBySerial)

module.exports = router;
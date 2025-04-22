const {Router} = require('express');
const router = Router();
const {detail, detailSalesOrder, shipSerial, detailSerial, findProductBySerial, detailSerialSalesOrder, deleteSerialSalesOrder} = require('../app/Controller/SoShipmentController');

router.get('/:shipment_code/detail', detail);
router.post('/ship-serial', shipSerial);
router.get('/:detail_shipment_oid/serial', detailSerial);
router.get('/:sales_order_code/sales-order', detailSalesOrder);
router.get('/:serial/serial/detail', findProductBySerial);
router.get('/:sod_oid/detail-serial', detailSerialSalesOrder);
router.delete('/:serial_oid/delete-serial-sales-order', deleteSerialSalesOrder);

module.exports = router;
const {Router} = require('express');
const router = Router();
const {detail, detailSerial} = require('../app/Controller/SoShipmentController');

router.get('/:shipment_code/detail', detail);
router.get('/:detail_shipment_oid/serial', detailSerial);

module.exports = router;
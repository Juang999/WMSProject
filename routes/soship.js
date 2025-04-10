const {Router} = require('express');
const router = Router();
const {detail} = require('../app/Controller/SoShipmentController');

router.get('/:shipment_code/detail', detail);

module.exports = router;
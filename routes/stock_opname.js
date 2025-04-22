const {Router} = require('express');
const router = Router();
const {authenticate} = require('../app/Middleware/middleware');
const {getLocationOpname, getProductOpname, getSerialOpname, index, detail, store, serialOpname, deleteSerial} = require('../app/Controller/StockOpnameController');

router.get('/', index);
router.post('/create', store);
router.get('/:opname_code/detail', detail);
router.get('/:somd_oid/serial', serialOpname);
router.get('/:entity_id/location', getLocationOpname);
router.get('/:entity_id/entity/:location_id/location/product', getProductOpname);
router.get('/:product_id/product/:location_id/location/serial', getSerialOpname);
router.delete('/:somdd_oid/somdd-oid/delete-serial', deleteSerial);

module.exports = router;
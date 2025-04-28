const {Router} = require('express');
const router = Router();
const {authenticate} = require('../app/Middleware/middleware');
const {
    deleteSerial,
    index, detail, 
    store, serialOpname, 
    getLocationOpname, getProductOpname, 
    getSerialOpname, getInventoryMaster, 
} = require('../app/Controller/StockOpnameController');

router.get('/', index);
router.post('/create', store);
router.get('/:opname_code/detail', detail);
router.get('/:somd_oid/serial', serialOpname);
router.get('/inventory-master', getInventoryMaster);
router.get('/:entity_id/location', getLocationOpname);
router.delete('/:somdd_oid/somdd-oid/delete-serial', deleteSerial);
router.get('/:entity_id/entity/:location_id/location/product', getProductOpname);
router.get('/:product_id/product/:location_id/location/serial', getSerialOpname);

module.exports = router;
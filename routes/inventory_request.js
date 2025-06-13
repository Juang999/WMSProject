const { Router } = require('express');
const router = Router();
const { 
    destroySerial,
    findSerialNumber,
    getHeaderInventoryRequest, findHeaderInventoryRequest, 
    findDetailInventoryRequest, storeSerialInventoryRequest 
} = require('../app/Controller/InventoryRequestController');
const authMiddleware = require('../app/Middleware/authenticate');

router.get('/', getHeaderInventoryRequest);
router.get('/:unique/find-serial', findSerialNumber);
router.post('/store-serial', [ authMiddleware ], storeSerialInventoryRequest);
router.get('/:inventory_request_code/find-header', findHeaderInventoryRequest);
router.get('/:detail_inventory_request_oid/find-detail', findDetailInventoryRequest);
router.delete('/:serial_inventory_request_oid/delete-serial', [ authMiddleware ], destroySerial);

module.exports = router;
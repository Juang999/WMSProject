const { Router } = require('express');
const router = Router();
const { getHeaderInventoryRequest, findHeaderInventoryRequest } = require('../app/Controller/InventoryRequestController');

router.get('/', getHeaderInventoryRequest);
router.get('/:inventory_request_oid/find-header', findHeaderInventoryRequest);

module.exports = router;
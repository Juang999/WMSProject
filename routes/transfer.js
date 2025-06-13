const { Router } = require('express');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');
const { findDataTransfer, storeDataTransferViaIr } = require('../app/Controller/TransferController');

router.get('/:transfer_code/find-data-transfer', findDataTransfer);
router.post('/transfer-ir', [ authMiddleware ], storeDataTransferViaIr);

module.exports = router;
const { Router } = require('express');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');
const { findDataTransfer, storeDataTransferViaIr, deleteDataSerial } = require('../app/Controller/TransferController');

router.get('/:transfer_code/find-data-transfer', findDataTransfer);
router.post('/transfer-ir', [ authMiddleware ], storeDataTransferViaIr);
router.delete('/:serial_transfer_oid/delete-serial-transfer', [ authMiddleware ], deleteDataSerial);

module.exports = router;
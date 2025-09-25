const { Router } = require('express');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');
const { findDataTransfer, storeDataTransferViaIr, deleteDataSerial, applyTransfer } = require('../app/Controller/TransferController');

router.get('/:transfer_code/find-data-transfer', findDataTransfer);
router.post('/transfer-ir', [ authMiddleware ], storeDataTransferViaIr);
router.put('/:header_transfer_oid/apply-transfer', [ authMiddleware ], applyTransfer);
router.delete('/:serial_transfer_oid/delete-serial-transfer', [ authMiddleware ], deleteDataSerial);

module.exports = router;
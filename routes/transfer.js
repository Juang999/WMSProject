const { Router } = require('express');
const router = Router();
const { findDataTransfer } = require('../app/Controller/TransferController');

router.get('/:transfer_code/find-data-transfer', findDataTransfer);

module.exports = router;
const { createReturnHeader, getAllHeader, findHeader, getHeaderScanOut, createReturnDetail } = require('../app/Controller/ReturnController');
const { Router } = require('express');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');

router.post('/create-header', [ authMiddleware ], createReturnHeader);
router.get('/', getAllHeader);
router.get('/:return_header_oid/find-header', findHeader);
router.get('/header-scanout', getHeaderScanOut);
router.post('/create-detail', [ authMiddleware ], createReturnDetail);

module.exports = router;
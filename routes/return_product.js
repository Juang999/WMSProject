const { createReturnHeader, getAllHeader, findHeader, getHeaderScanOut, createReturnDetail, deleteDetail } = require('../app/Controller/ReturnController');
const { Router } = require('express');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');

router.post('/create-header', [ authMiddleware ], createReturnHeader);
router.get('/', getAllHeader);
router.get('/:return_header_oid/find-header', findHeader);
router.get('/header-scanout', getHeaderScanOut);
router.post('/create-detail', [ authMiddleware ], createReturnDetail);
router.delete('/:rscd_rsc_oid/header-oid/:rscd_oid/detail-oid/delete-detail', [ authMiddleware ], deleteDetail);

module.exports = router;
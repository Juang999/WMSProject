const { Router } = require('express');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');
const { 
    updateHeader, deleteHeader,
    findHeader, getHeaderScanOut, 
    createReturnHeader, getAllHeader, 
    createReturnDetail, deleteDetail, 
} = require('../app/Controller/ReturnController');

router.post('/create-header', [ authMiddleware ], createReturnHeader);
router.get('/', getAllHeader);
router.get('/:return_header_oid/find-header', findHeader);
router.get('/header-scanout', getHeaderScanOut);
router.post('/create-detail', [ authMiddleware ], createReturnDetail);
router.delete('/:rscd_rsc_oid/header-oid/:rscd_oid/detail-oid/delete-detail', [ authMiddleware ], deleteDetail);
router.put('/:return_product_oid/update-header', [ authMiddleware ], updateHeader);
router.delete('/:rsc_oid/delete-header', [ authMiddleware ], deleteHeader);

module.exports = router;
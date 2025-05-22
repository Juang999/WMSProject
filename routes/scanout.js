const {Router} = require('express');
const router = Router();
const {createHeader, findScanoutHeader, createDetail, getHeader, deleteScannedOut, updateHeader, deleteHeaderScanOut} = require('../app/Controller/ScanoutController');
const authMiddleware = require('../app/Middleware/authenticate');

router.post('/header', [authMiddleware], createHeader);
router.post('/detail', [authMiddleware], createDetail);
router.get('/data-header', getHeader);
router.put('/:scanout_code/update', [authMiddleware], updateHeader);
router.delete('/:scd_oid/delete', [authMiddleware], deleteScannedOut);
router.get('/:scanout_code/header', findScanoutHeader);
router.delete('/:scanout_oid/delete-header', [authMiddleware], deleteHeaderScanOut);

module.exports = router;
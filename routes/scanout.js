const {Router} = require('express');
const router = Router();
const {createHeader, findScanoutHeader, createDetail, getHeader, deleteScannedOut} = require('../app/Controller/ScanoutController');

router.post('/header', createHeader);
router.post('/detail', createDetail);
router.get('/:scanout_code/header', findScanoutHeader);
router.get('/data-header', getHeader);
router.delete('/:scd_oid/delete', deleteScannedOut);

module.exports = router;
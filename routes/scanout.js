const {Router} = require('express');
const router = Router();
const {createHeader, findScanoutHeader, createDetail, getHeader, deleteScannedOut, updateHeader} = require('../app/Controller/ScanoutController');

router.post('/header', createHeader);
router.post('/detail', createDetail);
router.get('/data-header', getHeader);
router.put('/:scanout_code/update', updateHeader);
router.delete('/:scd_oid/delete', deleteScannedOut);
router.get('/:scanout_code/header', findScanoutHeader);

module.exports = router;
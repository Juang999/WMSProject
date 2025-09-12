const {Router} = require('express');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');
const {
    store, index, 
    getDataProduct, deleteDataSerial, 
    getDataSerial, historySerial, 
    searchUnique, searchSerialNumber,
    deleteSn, getHistorySerial
} = require('../app/Controller/PuttingController');

router.get('/history', historySerial);
router.post('/post', [authMiddleware], store);
router.get('/:uniq/search-uniq', searchUnique);
router.get('/:sublocation_id/result-scan', index);
router.get('/:serial_number/search-sn', searchSerialNumber);
router.get('/:sublocation_id/data-product', getDataProduct);
router.get('/:serial_number/history-uniq', getHistorySerial);
router.delete('/:invcd_oid/delete-scan', [authMiddleware], deleteDataSerial);
router.get('/:sublocation_id/sublocation/:product_id/product/product-scan', getDataSerial);
// router.delete('/:partnumber/partnumber/:serial_number/sn/delete', [authMiddleware], deleteSn);

module.exports = router;
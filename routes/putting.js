const {Router} = require('express');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');
const {store, index, getDataProduct, deleteDataSerial, getDataSerial, historySerial, getUniqAndPartnumber, getAllPartnumberBySn} = require('../app/Controller/PuttingController');

router.get('/history', historySerial);
router.post('/post', [authMiddleware], store);
router.get('/:sublocation_id/result-scan', index);
router.get('/:uniq/search-uniq', getUniqAndPartnumber);
router.get('/:sublocation_id/data-product', getDataProduct);
router.get('/:serial_number/search-sn', getAllPartnumberBySn);
router.delete('/:invcd_oid/delete-scan', [authMiddleware], deleteDataSerial);
router.get('/:sublocation_id/sublocation/:product_id/product/product-scan', getDataSerial);

module.exports = router;
const {Router} = require('express');
const router = Router();
const {store, index, getDataProduct, deleteDataSerial, getDataSerial, historySerial, getUniqAndPartnumber} = require('../app/Controller/PuttingController');
const authMiddleware = require('../app/Middleware/authenticate');

router.get('/history', historySerial);
router.post('/post', [authMiddleware], store);
router.get('/:sublocation_id/result-scan', index);
router.get('/:uniq/search-uniq', getUniqAndPartnumber);
router.get('/:sublocation_id/data-product', getDataProduct);
router.delete('/:invcd_oid/delete-scan', [authMiddleware], deleteDataSerial);
router.get('/:sublocation_id/sublocation/:product_id/product/product-scan', getDataSerial);

module.exports = router;
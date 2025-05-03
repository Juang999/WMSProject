const {Router} = require('express');
const router = Router();
const {store, index, getDataProduct, deleteDataSerial, getDataSerial, historySerial} = require('../app/Controller/PuttingController')

router.post('/post', store);
router.get('/history', historySerial);
router.get('/:sublocation_id/result-scan', index);
router.delete('/:invcd_oid/delete-scan', deleteDataSerial);
router.get('/:sublocation_id/data-product', getDataProduct);
router.get('/:sublocation_id/sublocation/:product_id/product/product-scan', getDataSerial);

module.exports = router;
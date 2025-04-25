const {Router} = require('express');
const router = Router();
const {store, index, getDataProduct, deleteDataSerial} = require('../app/Controller/PuttingController')

router.get('/:sublocation_id/result-scan', index);
router.post('/post', store);
router.delete('/:invcd_oid/delete-scan', deleteDataSerial);
router.get('/:sublocation_id/data-product', getDataProduct);

module.exports = router;
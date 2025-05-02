const {Router} = require('express');
const {move, getDataProduct} = require('../app/Controller/RegisterController');
const router = Router();

router.patch("/move", move);
router.get('/:sublocation_id/data-product', getDataProduct);

module.exports = router;
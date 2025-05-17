const {Router} = require('express');
const {move, getDataProduct} = require('../app/Controller/RegisterController');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');

router.patch("/move", [authMiddleware], move);
router.get('/:sublocation_id/data-product', getDataProduct);

module.exports = router;
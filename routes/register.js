const {Router} = require('express');
const {move, getDataProduct, getHistoryByStatus} = require('../app/Controller/RegisterController');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');

router.patch("/move", [authMiddleware], move);
router.get('/:status/history-by-status', getHistoryByStatus);
router.get('/:sublocation_id/data-product', getDataProduct);

module.exports = router;
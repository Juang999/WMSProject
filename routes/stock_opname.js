const {Router} = require('express');
const router = Router();
const {authenticate} = require('../app/Middleware/middleware');
const {index, detail, store} = require('../app/Controller/StockOpnameController');

router.get('/', index);
router.post('/create', store);
router.get('/:opname_code/detail', detail);

module.exports = router;
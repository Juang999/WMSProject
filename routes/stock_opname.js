const {Router} = require('express');
const router = Router();
const {authenticate} = require('../app/Middleware/middleware');
const {index, detail} = require('../app/Controller/StockOpnameController');

router.get('/', index);
router.get('/:opname_code/detail', detail);

module.exports = router;
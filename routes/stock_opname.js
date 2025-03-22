const {Router} = require('express');
const router = Router();
const {authenticate} = require('../app/Middleware/middleware');
const {index} = require('../app/Controller/StockOpnameController');

router.get('/', [authenticate], index);

module.exports = router;
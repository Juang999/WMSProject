const {Router} = require('express');
const router = Router();
const {index} = require('../app/Controller/OpnameController');
const {authenticate} = require('../app/Middleware/middleware');

router.get('/', [authenticate], index);

module.exports = router;
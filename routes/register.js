const {Router} = require('express');
const {move} = require('../app/Controller/RegisterController');
const router = Router();

router.patch("/move", move);

module.exports = router;
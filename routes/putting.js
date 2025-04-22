const {Router} = require('express');
const router = Router();
const {store} = require('../app/Controller/PuttingController')

router.post('/post', store);

module.exports = router;
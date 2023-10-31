var express = require('express');
var router = express.Router();
const UserController = require('../app/Controller/UserController')
const {authenticate} = require('../app/Middleware/Middleware')

router.post('/login', UserController.login)
router.get('/profile', [authenticate], UserController.profile)

module.exports = router;

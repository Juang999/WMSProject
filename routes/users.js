var express = require('express');
var router = express.Router();
const UserController = require('../app/Controller/UserController')
const {authenticate} = require('../app/Middleware/middleware')

router.post('/login', UserController.login);
router.get('/profile', [authenticate], UserController.profile);
router.get('/data-user', [ authenticate ], UserController.getDataUser);

module.exports = router;
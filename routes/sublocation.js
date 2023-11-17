const express = require('express')
const router = express.Router()
const app = express()
const {authenticate} = require('../app/Middleware/middleware')
const SublocationController = require('../app/Controller/SublocationController')

router.get('/', [authenticate], SublocationController.index);
router.post('/', [authenticate], SublocationController.store);
// router.patch('/capacity', [authenticate], SublocationController.)

module.exports = router
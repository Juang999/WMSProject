const express = require('express')
const router = express.Router()
const app = express()
const {authenticate} = require('../app/Middleware/middleware')
const SublocationController = require('../app/Controller/SublocationController')

router.get('/', [authenticate], SublocationController.index);
router.post('/', [authenticate], SublocationController.store);
router.patch('/:losc_id/capacity', [authenticate], SublocationController.inputCapacity)

module.exports = router
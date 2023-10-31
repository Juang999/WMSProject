const express = require('express')
const router = express.Router()
const MasterController = require('../app/Controller/MasterController')
const {authenticate} = require('../app/Middleware/Middleware')

router.get('/location', [authenticate], MasterController.getLocation)
router.get('/entity', [authenticate], MasterController.getEntity)
router.get('/account', [authenticate], MasterController.getAccount)
router.get('/partner', [authenticate], MasterController.getPartner)

module.exports = router
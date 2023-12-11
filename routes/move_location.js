const express = require('express')
const router = express.Router()
const MoveLocationController = require('../app/Controller/MoveLocationController')
const {authenticate} = require('../app/Middleware/middleware')

router.patch('/', [authenticate], MoveLocationController.moveToDestinationLocation)

module.exports = router
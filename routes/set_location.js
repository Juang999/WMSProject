const express = require('express')
const router = express.Router()
const {authenticate} = require('../app/Middleware/middleware')
const SetLocationController = require('../app/Controller/SetLocationController')


router.get('/:ptCode/detail', [authenticate], SetLocationController.findProduct);
router.get('/detail/:ptCode/:sublId/sublocation', [authenticate], SetLocationController.findProductWithSublocation);
router.patch('/update-qty/:ptCode/:sublName/sublocation', [authenticate], SetLocationController.updateProductWIthSublocation);

module.exports = router
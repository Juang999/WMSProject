const {Router} = require('express')
const router = Router()
const PickingListController = require('../app/Controller/PickingListController')
const {authenticate} = require('../app/Middleware/middleware')

router.get('/:soCode/detail', [authenticate], PickingListController.getDataSalesOrder)

module.exports = router
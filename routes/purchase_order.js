const express = require('express')
const router = express.Router()
const PurchaseOrderController = require('../app/Controller/PurchaseOrderController')
const {authenticate} = require('../app/Middleware/middleware')

router.get('/:po_oid/detail', [authenticate], PurchaseOrderController.detailPurchaseOrder)
router.patch('/update', [authenticate], PurchaseOrderController.updatePurchaseOrder)
router.get('/history', [authenticate], PurchaseOrderController.getHistoryPurchaseOrder)
router.get('/today', [authenticate], PurchaseOrderController.getPurchaseOrderToday)

module.exports = router
const express = require('express')
const router = express.Router()
const InventoryReceiptController = require('../app/Controller/InventoryReceiptController')
const {authenticate} = require('../app/Middleware/middleware')

router.post('/', [authenticate], InventoryReceiptController.store)
router.get('/history', [authenticate], InventoryReceiptController.getHistory)
router.patch('/:rium_oid/update-type', [authenticate], InventoryReceiptController.updateType)
router.put('/:riumd_oid/update', [authenticate], InventoryReceiptController.updateDetailInventoryReceipt)

module.exports = router
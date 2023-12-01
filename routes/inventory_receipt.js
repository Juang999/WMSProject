const express = require('express')
const router = express.Router()
const InventoryReceiptController = require('../app/Controller/InventoryReceiptController')
const {authenticate} = require('../app/Middleware/middleware')

router.post('/body', [authenticate], InventoryReceiptController.store)
router.get('/history', [authenticate], InventoryReceiptController.getHistory)
router.post('/header', [authenticate], InventoryReceiptController.createHeader)
router.patch('/:rium_oid/update-type', [authenticate], InventoryReceiptController.updateType)
router.put('/:riumd_oid/update', [authenticate], InventoryReceiptController.updateDetailInventoryReceipt)

// api to get data from exapro
router.get('/exapro', [authenticate], InventoryReceiptController.getInventoryReceiptFromExapro)
router.get('/exapro/:riu_oid/detail', [authenticate], InventoryReceiptController.getDetailInventoryReceiptFromExapro)

module.exports = router
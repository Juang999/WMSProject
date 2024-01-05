const express = require('express')
const router = express.Router()
const InventoryReceiptController = require('../app/Controller/InventoryReceiptController')
const {authenticate} = require('../app/Middleware/middleware')

router.get('/history', [authenticate], InventoryReceiptController.getHistory)
router.post('/header', [authenticate], InventoryReceiptController.createHeaderInventoryReceipt)
router.get('/temporary', [authenticate], InventoryReceiptController.getDataTemporary)
router.post('/temporary', [authenticate], InventoryReceiptController.inputIntoTemporary)
router.post('/body', [authenticate], InventoryReceiptController.inputDetailInventoryReceipt)
router.patch('/:rium_oid/update-type', [authenticate], InventoryReceiptController.updateType)
router.put('/:riumd_oid/update', [authenticate], InventoryReceiptController.updateDetailInventoryReceipt)
router.put('/temporary/:locstOid/update', [authenticate], InventoryReceiptController.updateDataTemporary)
router.delete('/temporary/:locstOid/delete', [authenticate], InventoryReceiptController.deleteDataTemporary)

// api to get data from exapro
router.get('/exapro', [authenticate], InventoryReceiptController.getInventoryReceiptExapro)
router.get('/exapro/:riu_oid/detail', [authenticate], InventoryReceiptController.getDetailInventoryReceiptExapro)

module.exports = router
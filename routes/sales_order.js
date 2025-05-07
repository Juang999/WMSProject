const express = require('express')
const router = express.Router()
const SalesOrderController = require('../app/Controller/SalesOrderController')
const {authenticate} = require('../app/Middleware/middleware')

router.get('/:so_code/detail', [authenticate], SalesOrderController.detailSalesOrder)
router.patch('/update', [authenticate], SalesOrderController.updateQtySalesOrder)
router.get('/history', [authenticate], SalesOrderController.getHistory)
router.get('/today', [authenticate], SalesOrderController.getSalesOrderToday)
router.patch('/scan-out', SalesOrderController.scanOut);
router.get('/:transaction_oid/scanned-out', SalesOrderController.getScannedOutSerial);

module.exports = router
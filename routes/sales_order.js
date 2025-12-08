const express = require('express')
const router = express.Router()
const SalesOrderController = require('../app/Controller/SalesOrderController')
const {authenticate} = require('../app/Middleware/middleware')
const { Requests } = require('../app/Kernel');

router.patch('/scan-out', SalesOrderController.scanOut);
router.get('/history', [authenticate], SalesOrderController.getHistory);
router.get('/all', [authenticate], SalesOrderController.getHeaderSalesOrder);
router.get('/today', [authenticate], SalesOrderController.getSalesOrderToday);
router.patch('/update', [authenticate], SalesOrderController.updateQtySalesOrder);
router.get('/:so_code/detail', [authenticate], SalesOrderController.detailSalesOrder);
router.get('/:transaction_oid/scanned-out', SalesOrderController.getScannedOutSerial);
router.patch('/:header_sales_order_oid/cancel', [ authenticate ], SalesOrderController.cancelSalesOrder);
router.delete('/:detail_sales_order_oid/delete-detail', [ authenticate ], SalesOrderController.deleteDetailSalesOrder);
router.get('/:header_sales_order_oid/detail-sales-order', [authenticate], SalesOrderController.getDetailSalesOrder);
router.post('/create', [ authenticate, Requests.SalesOrder.CreateSalesOrderRequest ], SalesOrderController.createSalesOrder);

module.exports = router
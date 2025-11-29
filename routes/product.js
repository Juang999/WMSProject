const express = require('express')
const router = express.Router()
const ProductController = require('../app/Controller/ProductController')
const {authenticate} = require('../app/Middleware/middleware')

router.get('/:pt_code/find', [authenticate], ProductController.searchProduct);
router.get('/quantity', ProductController.getProductsQuantity);
router.get('/:entity_id/entity/consigment-product', [ authenticate ], ProductController.getProductConsigmentSalesOrder);
router.get('/:entity_id/entity/product-sales-quotation', [ authenticate ], ProductController.getProductForSalesQuotation);

module.exports = router
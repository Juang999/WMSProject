const express = require('express')
const router = express.Router()
const ProductController = require('../app/Controller/ProductController')
const {authenticate} = require('../app/Middleware/middleware')

router.get('/:pt_code/find', [authenticate], ProductController.searchProduct);
router.post('/sublocation', [authenticate], ProductController.inputProductAndSublocation);
router.get('/detail/:ptCode/:sublId/sublocation', [authenticate], ProductController.findProductWithSublocation);
router.patch('/update-qty/:ptCode/:sublId/sublocation', [authenticate], ProductController.updateProductWIthSublocation);

module.exports = router
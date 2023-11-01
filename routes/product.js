const express = require('express')
const router = express.Router()
const ProductController = require('../app/Controller/ProductController')
const {authenticate} = require('../app/Middleware/middleware')

router.get('/:pt_code/find', [authenticate], ProductController.searchProduct)

module.exports = router
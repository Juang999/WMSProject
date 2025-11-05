const { Router } = require('express');
const router = Router();
const { getHeaderSalesQuotationByDate, getDetailSalesQuotation } = require('../app/Controller/SalesQuotationController');
const authMiddleware = require('../app/Middleware/authenticate');

router.get('/all', [ authMiddleware ], getHeaderSalesQuotationByDate);
router.get('/:header_sales_quotation_oid/detail', [ authMiddleware ], getDetailSalesQuotation);

module.exports = router;
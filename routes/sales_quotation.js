const { Router } = require('express');
const router = Router();
const { 
    updateDetailSalesQuotation, createDetailSalesQuotation,
    getHeaderSalesQuotationByDate, getDetailSalesQuotation, 
    createSalesQuotation, getDetailSalesQuotationForUpdate,
    updateHeaderSalesQuotation, deleteDetailSalesQuotation,
    getSalesQuotationType, getPackage, cancelSalesQuotation,
} = require('../app/Controller/SalesQuotationController');
const authMiddleware = require('../app/Middleware/authenticate');
const { Requests } = require('../app/Kernel');

// START: mengambil data untuk ditampilkan
router.get('/all', [ authMiddleware ], getHeaderSalesQuotationByDate);
router.get('/:header_sales_quotation_oid/detail', [ authMiddleware ], getDetailSalesQuotation);
// END: mengambil data untuk ditampilkan

// START: operasi CRUD header
router.get('/type', [ authMiddleware ], getSalesQuotationType);
router.get('/:entity_id/packages', [ authMiddleware ], getPackage);
router.patch('/:header_sq_oid/cancel-sq', [ authMiddleware ], cancelSalesQuotation);
router.get('/:sales_quotation_oid/detail-for-update', [ authMiddleware ], getDetailSalesQuotationForUpdate);
router.post('/create-sales-quotation', [ authMiddleware, Requests.SalesQuotation.CreateSalesQuotationRequest ], createSalesQuotation);
router.put('/:header_sq_oid/update-sq', [ authMiddleware, Requests.SalesQuotation.UpdateSalesQuotationRequest ], updateHeaderSalesQuotation);
// END: operasi CRUD

// START: router detail
router.post('/input-detail', [ authMiddleware, Requests.SalesQuotation.CreateDetailSalesQuotationRequest ], createDetailSalesQuotation);
router.put('/:detail_sales_quotation_oid/update-detail', [ authMiddleware, Requests.SalesQuotation.UpdateDetailSalesQuotationRequest ], updateDetailSalesQuotation);
router.delete('/:detail_salesquotation_oid/delete-ordered-product', [ authMiddleware ], deleteDetailSalesQuotation);

module.exports = router;
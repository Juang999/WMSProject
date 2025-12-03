const express = require('express')
const router = express.Router()
const MasterController = require('../app/Controller/MasterController')
const authMiddleware = require('../app/Middleware/authenticate');

router.get('/site', MasterController.getSite);
router.get('/entity', MasterController.getEntity);
router.get('/partner', MasterController.getPartner);
router.get('/location', MasterController.getLocation);
router.get('/category', MasterController.getCategory);
router.get('/sublocation-type', MasterController.getSublocationType);
router.get('/data-bank', [ authMiddleware ], MasterController.getBank);
router.get('/account', [ authMiddleware ], MasterController.getAccount);
router.get('/:location_id/sub-location', MasterController.getSublocation);
router.get('/currency', [ authMiddleware ], MasterController.getCurrency);
router.get('/subaccount', [ authMiddleware ], MasterController.getSubAccount);
router.get('/data-approval', [ authMiddleware ], MasterController.getApproval);
router.get('/cost-center', [ authMiddleware ], MasterController.getCostCenter);
router.get('/payment-type', [ authMiddleware ], MasterController.getPaymentType);
router.get('/credit-terms', [ authMiddleware ], MasterController.getCreditTerms);
router.get('/payment-method', [ authMiddleware ], MasterController.getPaymentMethod);
router.get('/area-pricelist', [ authMiddleware ], MasterController.getAreaPriceListt);
router.get('/sales-program', [ authMiddleware ], MasterController.getSalesProgramName);
router.get('/:entity_id/location-sales-quotataion', [ authMiddleware ], MasterController.getLocationSalesQuotation);
router.get('/:entity_id/price-list', [ authMiddleware ], MasterController.getPriceList);

module.exports = router
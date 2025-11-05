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
router.get('/account', [ authMiddleware ], MasterController.getAccount);
router.get('/:location_id/sub-location', MasterController.getSublocation);
router.get('/subaccount', [ authMiddleware ], MasterController.getSubAccount);
router.get('/cost-center', [ authMiddleware ], MasterController.getCostCenter);
router.get('/:enttiy_id/location-sales-quotataion', [ authMiddleware ], MasterController.getLocationSalesQuotation);

module.exports = router
const { Router } = require('express');
const router = Router();
const { getSalesPersonByEntity, getCustomerByEntity } = require('../app/Controller/PartnerController');
const authMiddleware = require('../app/Middleware/authenticate');

router.get('/:entity_id/sales-person-by-entity', [ authMiddleware ], getSalesPersonByEntity);
router.get('/:entity_id/customer-by-entity', [ authMiddleware ], getCustomerByEntity);

module.exports = router;
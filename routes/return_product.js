const { createReturnHeader, getAllHeader, getHeaderScanOut } = require('../app/Controller/ReturnController');
const { Router } = require('express');
const router = Router();
const authMiddleware = require('../app/Middleware/authenticate');

router.post('/create-header', [ authMiddleware ], createReturnHeader);
router.get('/', getAllHeader);
router.get('/header-scanout', getHeaderScanOut);

module.exports = router;
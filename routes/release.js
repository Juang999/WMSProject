const { Router } = require('express');
const router = Router();
const { getAllHoldSerial, getHoldSerial, releaseSerial } = require('../app/Controller/ReleaseController');
const authMiddleware = require('../app/Middleware/authenticate');

router.get('/all-hold-serials-partnumber', [authMiddleware], getAllHoldSerial);
router.get('/:partnumber/get-hold-serial', getHoldSerial);
router.put('/release-serials', [authMiddleware], releaseSerial);

module.exports = router;
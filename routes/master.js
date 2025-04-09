const express = require('express')
const router = express.Router()
const MasterController = require('../app/Controller/MasterController')
const {authenticate} = require('../app/Middleware/middleware')

router.get('/entity', MasterController.getEntity);
router.get('/account', MasterController.getAccount);
router.get('/partner', MasterController.getPartner);
router.get('/location', MasterController.getLocation);
router.get('/category', MasterController.getCategory);
router.get('/sublocation-type', MasterController.getSublocationType);

module.exports = router
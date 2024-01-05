const express = require('express')
const router = express.Router()
const app = express()
const {authenticate} = require('../app/Middleware/middleware')
const SublocationController = require('../app/Controller/SublocationController')

router.get('/', [authenticate], SublocationController.getActiveSublocation);
router.get('/all', [authenticate], SublocationController.getAllSublocation);
router.get('/git', [authenticate], SublocationController.getAllGITSublocation);
router.post('/temporary-sublocation', [authenticate], SublocationController.inputIntoTemporaryTable);
router.get('/:sublName/detail', [authenticate], SublocationController.getDetailSublocationWithProducts);
router.patch('/:locsOid/update-temporary-sublocation', [authenticate], SublocationController.updateTemporarySublocation)

/*
[not used router]

*/ 
router.post('/', [authenticate], SublocationController.store);
router.patch('/:locs_id/capacity', [authenticate], SublocationController.updateCapacitySublocation);

module.exports = router
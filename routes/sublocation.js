const express = require('express')
const router = express.Router()
const app = express()
const {authenticate} = require('../app/Middleware/middleware')
const SublocationController = require('../app/Controller/SublocationController')

router.get('/', [authenticate], SublocationController.index);
router.post('/', [authenticate], SublocationController.store);
router.get('/all', [authenticate], SublocationController.getAllSublocation);
router.get('/:sublName/detail', [authenticate], SublocationController.show);
router.patch('/:locs_id/capacity', [authenticate], SublocationController.inputCapacity);
router.post('/temporary-sublocation', [authenticate], SublocationController.inputTemporary);

module.exports = router
const {Router} = require('express');
const router = Router();
const {store, index} = require('../app/Controller/PuttingController')

router.get('/:sublocation_id/result-scan', index);
router.post('/post', store);

module.exports = router;
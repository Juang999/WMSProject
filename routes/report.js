const { Router } = require('express');
const router = Router()
const { registeringReport } = require('../app/Controller/ReportController');

router.get('/register', registeringReport);

module.exports = router;
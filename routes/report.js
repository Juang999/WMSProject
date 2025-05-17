const { Router } = require('express');
const router = Router()
const { registeringReport, registerReportByUser } = require('../app/Controller/ReportController');

router.get('/register', registeringReport);
router.get('/:user_id/register-by-user', registerReportByUser);

module.exports = router;
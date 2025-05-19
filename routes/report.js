const { Router } = require('express');
const router = Router()
const { registeringReport, registerReportByUser, getSerialByDate, getSerialScanOutByDate } = require('../app/Controller/ReportController');

router.get('/register', registeringReport);
router.get('/serial-by-date', getSerialByDate);
router.get('/serial-scanout-by-date', getSerialScanOutByDate);
router.get('/:user_id/register-by-user', registerReportByUser);

module.exports = router;
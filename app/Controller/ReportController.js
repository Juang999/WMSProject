const {InventoryService} = require('../Services/ServiceContainer');
const moment = require('moment')

class ReportController {
    registeringReport = (req, res) => {
        const date = (req.query.date) ? req.query.date : moment().format('YYYY-MM-DD')

        InventoryService.reportRegistering(date)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }
}

module.exports = new ReportController();
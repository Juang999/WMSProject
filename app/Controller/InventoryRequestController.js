const { InventoryRequestService } = require('../Services/ServiceContainer');
const moment = require('moment');

class InventoryRequestController {
    getHeaderInventoryRequest = (req, res) => {
        let search = req.query.search || '';
        let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD') : moment().startOf('months').format('YYYY-MM-DD');
        let endDate = (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD') : moment().endOf('months').format('YYYY-MM-DD');

        InventoryRequestService.retrieveDataInventoryRequest(search, startDate, endDate)
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

    findHeaderInventoryRequest = (req, res) => {
        InventoryRequestService.findHeaderInventoryReceipt(req.params.inventory_request_oid)
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

module.exports = new InventoryRequestController();
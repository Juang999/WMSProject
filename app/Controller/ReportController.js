const {InventoryService, UserService} = require('../Services/ServiceContainer');
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

    registerReportByUser = async (req, res) => {
        try {
            const date = (req.query.date) ? moment(req.query.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            const dataUser = await UserService.userProfile(req.params.user_id);
            const dataScanned = await InventoryService.reportRegisterByUser(dataUser.dataValues, date);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: {
                        username: dataUser.dataValues.username,
                        scanned_product: dataScanned
                    },
                    error: null
                })
        } catch (error) {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }
}

module.exports = new ReportController();
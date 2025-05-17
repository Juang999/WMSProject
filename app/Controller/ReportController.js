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

            if (!dataUser) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'not found!',
                        data: null,
                        error: 'not found!'
                    });

                return;
            }

            const [
                totalDataRegistered, 
                totalDataMoved, 
                dataScanned
            ] = await Promise.all([
                    InventoryService.countDataUniq(dataUser.dataValues, 'registered!', date), 
                    InventoryService.countDataUniq(dataUser.dataValues, 'moved!', date), 
                    InventoryService.reportRegisterByUser(dataUser.dataValues, date)
                ]);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: {
                        username: dataUser.dataValues.username,
                        total_registered: (totalDataRegistered) ? totalDataRegistered.dataValues.total_data : 0,
                        total_moved: (totalDataMoved) ? totalDataMoved.dataValues.total_data : 0,
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
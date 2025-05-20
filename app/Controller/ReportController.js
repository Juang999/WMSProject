const {InventoryService, UserService, ScanoutService} = require('../Services/ServiceContainer');
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
                dataScanned,
                dataMoved,
            ] = await Promise.all([
                    InventoryService.countRegisteredUniq(dataUser.dataValues, date), 
                    InventoryService.countMovedUniq(dataUser.dataValues, date), 
                    InventoryService.reportRegisterByUser(dataUser.dataValues, date),
                    InventoryService.reportMoveByUser(dataUser.dataValues, date),
                ]);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: {
                        username: dataUser.dataValues.username,
                        total_registered: (totalDataRegistered) ? totalDataRegistered.dataValues.total_data : 0,
                        total_moved: (totalDataMoved) ? totalDataMoved.dataValues.total_data : 0,
                        scanned_product: dataScanned,
                        moved_product: dataMoved
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

    getSerialByDate = (req, res) => {
        let date = (req.query.date) ? moment(req.query.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        let productName = (req.query.product_name) ? req.query.product_name : '';
        let productCode = (req.query.product_code) ? req.query.product_code : '';
        let location = (req.query.location) ? req.query.location : '';
        let subLocation = (req.query.sublocation) ? req.query.sublocation : '';
        let operator = (req.query.operator) ? req.query.operator : '';
        let unique = (req.query.unique) ? req.query.unique : '';

        InventoryService.serialByDate(date, productName, productCode, location, subLocation, operator, unique)
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

    getSerialScanOutByDate = (req, res) => {
        let date = (req.query.date) ? moment(req.query.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        let scanoutCode = (req.query.scanout_code) ? req.query.scanout_code : '';
        let productName = (req.query.product_name) ? req.query.product_name : '';
        let productCode = (req.query.product_code) ? req.query.product_code : '';
        let locationName = (req.query.location) ? req.query.location : '';
        let subLocationName = (req.query.sublocation) ? req.query.sublocation : '';
        let operator = (req.query.operator) ? req.query.operator : '';
        let unique = (req.query.unique) ? req.query.unique : '';

        ScanoutService.serialScanOutByDate(date, scanoutCode, productName, productCode, locationName, subLocationName, operator, unique)
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
const { InventoryRequestService, InventoryService } = require('../Services/ServiceContainer');
const { sequelize } = require('../../models');
const moment = require('moment');
const {Authentication} = require('../../helper/helper')

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

    findDetailInventoryRequest = (req, res) => {
        InventoryRequestService.findDetailInventoryRequest(req.params.detail_inventory_request_oid)
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

    storeSerialInventoryRequest = async (req, res) => {
        let transaction = await sequelize.transaction();

        try {
            let [dataSerialNumber, dataSerialInventoryRequest] = await Promise.all([
                InventoryService.findSerialNumber(req.body.unique, transaction),
                InventoryRequestService.findSerialInventoryRequest(req.body.unique, req.body.detail_inventory_request_oid)
            ]);

            if (dataSerialInventoryRequest) {
                res.status(300)
                    .json({
                        status: 'already exist',
                        message: 'serial already scanned',
                        data: null,
                        error: 'serial already scanned'
                    });

                return;
            }

            if (!dataSerialNumber) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'serial not found',
                        data: null,
                        error: 'serial not found'
                    });

                return;
            }

            if (dataSerialNumber.dataValues.uniq == null) {
                res.status(404)
                    .json({
                        status: 'unregistered',
                        message: 'unregistered serial',
                        data: null,
                        error: 'unregistered serial'
                    });

                return;
            }

            if (parseInt(dataSerialNumber.dataValues.qty) != 1) {
                res.status(404)
                    .json({
                        status: 'already gone',
                        message: 'serial already gone',
                        data: null,
                        error: 'serial already gone'
                    });

                return;
            }

            let result = await InventoryRequestService.storeSerialInventoryRequest(
                dataSerialNumber.dataValues, 
                req.body.detail_inventory_request_oid, 
                Authentication.user().usernama, 
                transaction
            )

            await transaction.commit();

            res.status(200)
                .json({
                    status: 'success',
                    message: 'stored!',
                    data: result,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    destroySerial = (req, res) => {
        InventoryRequestService.deleteSerial(req.params.serial_inventory_request_oid)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'deleted',
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
const { Authentication } = require('../../helper/helper');
const { sequelize } = require('../../models');
const { ScanoutService, ReturnService, ProductService, InventoryService } = require('../Services/ServiceContainer');

class ReturnController {
    getAllHeader = (req, res) => {
        let return_code = (req.query.return_code) ? req.query.return_code : '';
        let scanout_code = (req.query.scanout_code) ? req.query.scanout_code : '';
        let so_code = (req.query.so_code) ? req.params.sc_code : '';

        ReturnService.getHeader({return_code, scanout_code, so_code})
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

    findHeader = (req, res) => {
        Promise.all([
            ReturnService.findHeader(req.params.return_header_oid),
            ReturnService.getSerialHeader(req.params.return_header_oid)
        ])
        .then(( [ headerReturn, serialReturn ] ) => {
            if (!headerReturn) {
                headerReturn = [];
            } else {
                headerReturn.dataValues.detail_return_product = serialReturn;
            }

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: headerReturn,
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

    findReport = (req, res) => {
        ReturnService.findReportHeader(req.params.return_header_oid)
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

    createReturnHeader = async (req, res) => {
        try {
            let dataScanOut = await ScanoutService.findDataScanOutByOid(req.body.scanout_oid);

            if (!dataScanOut) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'data scanout not found!',
                        data: null,
                        error: 'data scanout not found!'
                    })

                return;
            }

            let result = await ReturnService.insertHeader({
                sc_oid: dataScanOut.dataValues.sc_oid,
                sc_code: dataScanOut.dataValues.sc_code,
                entity_id: dataScanOut.dataValues.sc_en_id,
                userid: req.body.userid,
                remarks: req.body.remarks
            }, Authentication.user());

            res.status(200)
                .json({
                    status: 'success',
                    message: 'created',
                    data: result,
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

    createReturnDetail = (req, res) => {
        sequelize.transaction(async t => {
            let [dataSerial, detailDataReturn] = await Promise.all([
                InventoryService.findSerialNumber(req.body.qrbarcode, t), 
                ReturnService.findDetail(req.body.header_return_oid, req.body.qrbarcode)
            ]);

            if (!dataSerial) {
                return {
                    statusCode: 404,
                    json: {
                        status: 'not found',
                        message: 'serial number not found',
                        data: null,
                        error: 'serial number not found'
                    }
                }
            }

            if (dataSerial.dataValues.uniq == null) {
                return {
                    statusCode: 300,
                    json: {
                        status: 'rejected',
                        message: 'unregistered serial number',
                        data: null,
                        error: 'unregistered serial number',
                    }
                }
            }

            if (detailDataReturn && detailDataReturn.dataValues.rscd_pt_id != dataSerial.dataValues.invcd_pt_id) {
                return {
                    statusCode: 300,
                    json: {
                        status: 'rejected',
                        message: 'qrbarcode for this return already exist with another partnumber',
                        data: null,
                        error: 'qrbarcode for this return already exist with another partnumber'
                    }
                }
            }

            if (!detailDataReturn) {
                await ReturnService.insertDetail({
                    rsc_oid: req.body.header_return_oid,
                    pt_id: dataSerial.dataValues.invcd_pt_id,
                    qrbarcode: req.body.qrbarcode
                }, Authentication.user().usernama)
            }

            return {
                    statusCode: 200,
                    json: {
                        status: 'success',
                        message: 'created!',
                        data: null,
                        error: null
                    }
                }
        })
        .then(result => {
            res.status(result.statusCode)
                .json(result.json);
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                });
        })
    }

    getHeaderScanOut = (req, res) => {
        let search = (req.query.search) ? req.query.search : '';

        ScanoutService.getHeaderScanOut(search)
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

    deleteDetail = (req, res) => {
        ReturnService.deleteDetail(req.params.rscd_rsc_oid, req.params.rscd_oid)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'deleted!',
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

    updateHeader = async (req, res) => {
        try {
            let returnScanOutOid = req.params.return_product_oid;
            let dataScanOut = null;

            let headerReturnProduct = await ReturnService.findHeader(returnScanOutOid);

            if (!headerReturnProduct) {
                res.status(404)
                    .json({
                        status: 'rejected',
                        message: 'header not found!',
                        data: null,
                        error: 'header not found!'
                    })
            }

            if (req.body.scanout_oid != null) {
                dataScanOut = await ScanoutService.findDataScanOutByOid(req.body.scanout_oid);
            }

            let bodyUpdate = {
                pic_id: (req.body.pic_id == null) ? headerReturnProduct.dataValues.pic_id : req.body.pic_id,
                remarks: (req.body.remarks == null) ? headerReturnProduct.dataValues.remarks : req.body.remarks,
                scanout_oid: (dataScanOut == null) ? headerReturnProduct.dataValues.scanout_oid : req.body.scanout_oid,
                scanout_code: (dataScanOut == null) ? headerReturnProduct.dataValues.scanout_code : dataScanOut.dataValues.sc_code,
                status_id: (req.body.status_id == null) ? headerReturnProduct.dataValues.status_id : req.body.status_id,
            }

            let result = await ReturnService.updateHeader(bodyUpdate, Authentication.user(), returnScanOutOid);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'updated',
                    data: result,
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

    deleteHeader = (req, res) => {
        ReturnService.deleteHeader(req.params.rsc_oid)
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

    returnSerials = async (req, res) => {
        let { header_return_oid, location_id, sublocation_id, serials } = req.body;
        let transaction = await sequelize.transaction();

        try {
            let dataSerials = serials.split(',');

            await Promise.all([
                InventoryService.bulkUpdateSerials(dataSerials, location_id, sublocation_id, Authentication.user().usernama, transaction),
                ReturnService.bulkUpdateSerials(dataSerials, location_id, sublocation_id, header_return_oid, Authentication.user().usernama, transaction)
            ])

            await transaction.commit();

            res.status(200)
                .json({
                    status: 'success',
                    message: 'updated',
                    data: null,
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
                });
        }
    }
}

module.exports = new ReturnController();
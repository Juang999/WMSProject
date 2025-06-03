const { ScanoutService, ReturnService, ProductService } = require('../Services/ServiceContainer');
const { Authentication } = require('../../helper/helper');

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
        ReturnService.findHeader(req.params.return_header_oid)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
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

    createReturnDetail = async (req, res) => {
        try {
            let [ dataProduct, dataDetailReturn ] = await Promise.all([
                ProductService.findProductByPartnumber(req.body.partnumber),
                ReturnService.findDetail(req.body.header_return_oid, req.body.qrbarcode)
            ]);

            if (!dataProduct) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'product not found',
                        data: null,
                        error: 'product not found'
                    })

                return;
            }

            if (dataDetailReturn && dataDetailReturn.dataValues.rscd_pt_id != dataProduct.dataValues.pt_id) {
                res.status(300)
                    .json({
                        status: 'rejected',
                        message: 'qrbarcode for this return already exist with another partnumber',
                        data: null,
                        error: 'qrbarcode for this return already exist with another partnumber'
                    });

                return;
            }

            
            if (!dataDetailReturn) {
                await ReturnService.insertDetail({
                    rsc_oid: req.body.header_return_oid,
                    pt_id: dataProduct.dataValues.pt_id,
                    qrbarcode: req.body.qrbarcode
                }, Authentication.user().usernama)
            }

            res.status(200)
                .json({
                    status: 'success',
                    message: 'created!',
                    data: null,
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
}

module.exports = new ReturnController();
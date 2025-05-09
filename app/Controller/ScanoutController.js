const {ScanoutService, InventoryService} = require('../Services/ServiceContainer');
const {sequelize} = require('../../models');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');

class ScanoutController {
    createHeader = (req, res) => {
        ScanoutService.createHeaderScanout(req.body)
        .then(result => {
            res.status(200).json({
                status: 'success',
                message: 'Scanout header created successfully',
                data: result,
                error: null
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: 'Failed to create scanout header',
                data: null,
                error: err.message
            })
        })
    }

    findScanoutHeader = (req, res) => {
        ScanoutService.findScanoutHeader(req.params.scanout_code)
        .then(result => {
            if (result) {
                res.status(200).json({
                    status: 'success',
                    message: 'Scanout header found',
                    data: result,
                    error: null
                })
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Scanout header not found',
                    data: null,
                    error: null
                })
            }
        })
    }

    createDetail = (req, res) => {
        sequelize.transaction(async t => {
            let dataSerial = await InventoryService.findSerialNumber(req.body.uniq, t);

            if (!dataSerial) {
                return this.returnResponse(300, 'rejected', 'serial not found', null)
            }

            if (dataSerial.dataValues.qty == 0) {
                return this.returnResponse(300, 'rejected', 'serial has scanned out!', null)
            }

            if (dataSerial.dataValues.uniq == null || dataSerial.dataValues.invcd_locs_id == null) {
                return this.returnResponse(300, 'rejected', 'Unregistered serial', null)
            }

            await Promise.all([
                InventoryService.scanoutSerial(dataSerial.dataValues.invcd_oid, req.body.scanout_oid, t),
                ScanoutService.createDetailScanout({
                    entity_id: dataSerial.dataValues.entity_id,
                    scanout_oid: req.body.scanout_oid,
                    product_id: dataSerial.dataValues.invcd_pt_id,
                    location_id: dataSerial.dataValues.invcd_loc_id,
                    sublocation_id: dataSerial.dataValues.invcd_locs_id,
                    serial: req.body.uniq,
                }, t),
                InventoryService.createHistory([{
                    invcdh_oid: uuidv4(),
                    invcdh_dom_id: dataSerial.dataValues.invcd_dom_id,
                    invcdh_en_id: dataSerial.dataValues.invcd_en_id,
                    invcdh_pt_id: dataSerial.dataValues.invcd_pt_id,
                    invcdh_loc_from_id: dataSerial.dataValues.invcd_loc_id,
                    invcdh_locs_from_id: dataSerial.dataValues.invcd_locs_id,
                    invcdh_qrbarcode: dataSerial.dataValues.invcd_qrbarcode,
                    invcdh_status: 'scanned out!',
                    invcdh_remarks: 'scanned out',
                    invcdh_created_by: 'system',
                    invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
                }], t)
            ])

            return this.returnResponse(200, 'success', 'success to scan out serial', null)
        })
        .then(result => {
            res.status(result.code)
                .json(result.json)
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'failed to scan out serial',
                    data: null,
                    error: err.message
                })
        })
    }

    getHeader = (req, res) => {
        let search = req.query.search || '';

        ScanoutService.getAllHeaderr(search)
        .then(result => {
            res.status(200).json({
                status: 'success',
                message: 'Scanout header found',
                data: result,
                error: null
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: 'Failed to get scanout header',
                data: null,
                error: err.message
            })
        })
    }

    returnResponse = (code, status, message, data) => {
		return {code, json: {status, message, data, error: null}}
	}
}

module.exports = new ScanoutController();
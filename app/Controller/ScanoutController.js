const {ScanoutService, InventoryService} = require('../Services/ServiceContainer');
const {sequelize} = require('../../models');

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

            if (dataSerial.dataValues.entity_id != req.body.entity_id) {
                return this.returnResponse(300, 'rejected', 'serial not belong to this entity', null)
            }

            if (dataSerial.dataValues.uniq == null || dataSerial.dataValues.invcd_locs_id == null) {
                return this.returnResponse(300, 'rejected', 'Unregistered serial', null)
            }

            await ScanoutService.createDetailScanout({
                entity_id: req.body.entity_id,
                scanout_oid: req.body.scanout_oid,
                product_id: dataSerial.dataValues.invcd_pt_id,
                location_id: dataSerial.dataValues.invcd_loc_id,
                sublocation_id: dataSerial.dataValues.invcd_locs_id,
                serial: req.body.uniq,
            }, t)

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
const {ScanoutService, InventoryService} = require('../Services/ServiceContainer');
const {sequelize, Sequelize} = require('../../models');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');
const {error: errorLog} = require('../../helper/Logging');

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
            let dataSerial = await InventoryService.newFindRegisteredSerialNumber(req.body.uniq, t);

            if (!dataSerial) {
                return this.returnResponse(300, 'rejected', 'serial not found', null)
            }

            if (dataSerial.dataValues.qty == 0) {
                return this.returnResponse(300, 'rejected', 'serial has scanned out!', null)
            }

            if (dataSerial.dataValues.invcd_locs_id == null) {
                await this.registerSerial(dataSerial, req.body.uniq, t);
            }

            let newDataSerial = await InventoryService.newFindRegisteredSerialNumber(req.body.uniq, t);

            await Promise.all([
                InventoryService.scanoutSerial(newDataSerial.dataValues.invcd_oid, req.body.scanout_oid, t),
                ScanoutService.createDetailScanout({
                    entity_id: newDataSerial.dataValues.entity_id,
                    scanout_oid: req.body.scanout_oid,
                    product_id: newDataSerial.dataValues.invcd_pt_id,
                    location_id: newDataSerial.dataValues.invcd_loc_id,
                    sublocation_id: newDataSerial.dataValues.invcd_locs_id,
                    serial: req.body.uniq,
                }, t),
                InventoryService.createHistory([{
                    invcdh_oid: uuidv4(),
                    invcdh_dom_id: newDataSerial.dataValues.invcd_dom_id,
                    invcdh_en_id: newDataSerial.dataValues.invcd_en_id,
                    invcdh_pt_id: newDataSerial.dataValues.invcd_pt_id,
                    invcdh_loc_from_id: newDataSerial.dataValues.invcd_loc_id,
                    invcdh_locs_from_id: newDataSerial.dataValues.invcd_locs_id,
                    invcdh_qrbarcode: newDataSerial.dataValues.uniq,
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
            errorLog(`INPUT SERIAL`, err.message)

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

    deleteScannedOut = (req, res) => {
        sequelize.transaction(async t => {
            let dataScannedOut = await ScanoutService.findSerialAlreadyScanned(req.params.scd_oid);
            let dataSerial = await InventoryService.newFindRegisteredSerialNumber(dataScannedOut.dataValues.scd_serial, t);

            if (!dataScannedOut) {
                return this.returnResponse(300, 'rejected', 'serial not found', null)
            }

            await Promise.all([
                InventoryService.newReleaseSerial(dataScannedOut.dataValues.scd_serial, t),
                ScanoutService.deleteSerial(req.params.scd_oid, t),
                InventoryService.createHistory([{
                    invcdh_oid: uuidv4(),
                    invcdh_dom_id: dataSerial.dataValues.invcd_dom_id,
                    invcdh_en_id: dataSerial.dataValues.invcd_en_id,
                    invcdh_pt_id: dataSerial.dataValues.invcd_pt_id,
                    invcdh_loc_from_id: dataSerial.dataValues.invcd_loc_id,
                    invcdh_locs_from_id: dataSerial.dataValues.invcd_locs_id,
                    invcdh_qrbarcode: dataSerial.dataValues.invcd_qrbarcode,
                    invcdh_status: 'released scanned out!',
                    invcdh_remarks: 'released scanned out',
                    invcdh_created_by: 'system',
                    invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
                }], t)
            ])

            return this.returnResponse(200, 'success', 'success to delete scanned out serial', null)
        })
        .then(result => {
            res.status(result.code)
                .json(result.json)
        })
        .catch(err => {
            errorLog(`DELETE SCANNED OUT`, err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'failed to delete scanned out serial',
                    data: null,
                    error: err.message
                })
        })
    }

    updateHeader = async (req, res) => {
        try {
            let dataHeader = await ScanoutService.findScanoutHeader(req.params.scanout_code);

            if (!dataHeader) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Scanout header not found',
                    data: null,
                    error: null
                })
            }

            await ScanoutService.updateHeaderScanout(dataHeader.dataValues.sc_oid, {
                remarks: (req.body.remarks) ? req.body.remarks : dataHeader.dataValues.sc_remarks,
                pack_code: (req.body.pack_code) ? req.body.pack_code : dataHeader.dataValues.sc_pack_code,
                so_code: (req.body.so_code) ? req.body.so_code : dataHeader.dataValues.sc_so_code,
                receiver: (req.body.receiver) ? req.body.receiver : dataHeader.dataValues.sc_receiver_name,
                transaction_id: (req.body.transaction_id) ? req.body.transaction_id : dataHeader.dataValues.sc_trans_id
            })

            return res.status(200).json({
                status: 'success',
                message: 'Scanout header updated successfully',
                data: null,
                error: null
            })
        } catch (error) {
            errorLog(`UPDATE SCANOUT HEADER`, error.message)

            return res.status(500).json({
                status: 'error',
                message: 'Failed to update scanout header',
                data: null,
                error: error.message
            })
        }
    }

    returnResponse = (code, status, message, data) => {
		return {code, json: {status, message, data, error: null}}
	}

    registerSerial = async (dataSerial, uniqSerial, transaction) => {
        let sublocationId = null;

        switch (dataSerial.dataValues.invcd_en_id) {
            case 1:
                sublocationId = 10021162;
                break;

            case 2:
                sublocationId = 20021163;
                break;

            case 3:
                sublocationId = 30021164;
                break;
        }

        await Promise.all([
            InventoryService.updateSerial(dataSerial.dataValues.invcd_oid, {
                location_id: Sequelize.literal(`"invcd_loc_id"`),
                sublocation_id: sublocationId,
                serial_number: uniqSerial
            }, transaction),
            InventoryService.createHistory([{
                invcdh_oid: uuidv4(),
                invcdh_dom_id: 1,
                invcdh_en_id: dataSerial.dataValues.invcd_en_id,
                invcdh_pt_id: dataSerial.dataValues.invcd_pt_id,
                invcdh_loc_from_id: dataSerial.dataValues.invcd_loc_id,
                invcdh_locs_from_id: sublocationId,
                invcdh_qrbarcode: uniqSerial,
                invcdh_status: 'registered!',
                invcdh_remarks: 'registered',
                invcdh_created_by: 'system',
                invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }], transaction)
        ])
    }
}

module.exports = new ScanoutController();
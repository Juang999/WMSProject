const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../../models');
const { Authentication } = require('../../helper/helper');
const { info, error: errorLog } = require('../../helper/Logging');
const { InventoryReceiptService, InventoryService } = require('../Services/ServiceContainer');

class ReleaseController {
    getAllHoldSerial = async ( req, res ) => {
        try {
            let conditions = {
                transaction_code: req.query.ru_number || '',
                search: req.query.search || ''
            }

            let result = await InventoryReceiptService.retrieveHoldSerial( conditions );

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            errorLog("GET ALL HOLD SERIALS", error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }
    
    getHoldSerial = async ( req, res ) => {
        try {
            let partNumber = req.params.partnumber;
            let ruNumber = req.query.ru_number;

            let result = await InventoryReceiptService.retrieveHoldSerialByPartNumber(partNumber, ruNumber);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
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

    releaseSerial = async ( req, res ) => {
        let transaction = await sequelize.transaction();
        let user = Authentication.user();
        let dataHistorical = [];

        try {
            let bulkSerial = req.body.serials.split(',');

            for (const singularSerial of bulkSerial) {
                let serialNumber = await InventoryService.findSerialNumber(singularSerial, transaction);
                let serialOid = serialNumber.dataValues.invcd_oid;
                let locationId = serialNumber.dataValues.invcd_loc_id;
                let subLocationId = serialNumber.dataValues.invcd_locs_id;
                let totalSerialByLocation = await InventoryService.findDataLocation(locationId, singularSerial);

                await InventoryService.updateSerial(serialOid, {
                    inventory_oid: totalSerialByLocation.dataValues.invc_oid,
                    location_id: locationId,
                    sublocation_id: subLocationId,
                    serial_number: singularSerial,
                    transaction_code: null,
                    transaction_oid: null
                }, user.usernama, transaction);

                dataHistorical.push({
                    invcdh_oid: uuidv4(),
                    invcdh_dom_id: 1,
                    invcdh_en_id: serialNumber.dataValues.pt_en_id,
                    invcdh_pt_id: serialNumber.dataValues.pt_id,
                    invcdh_loc_to_id: serialNumber.dataValues.invcd_loc_id,
                    invcdh_locs_to_id: serialNumber.dataValues.invcd_locs_id,
                    invcdh_qrbarcode: singularSerial,
                    invcdh_status: 'released!',
                    invcdh_remarks: 'released!',
                    invcdh_created_by: user.usernama,
                    invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    invcdh_transaction_oid: null,
                    invcdh_transaction_code: null
                })
            }

            await InventoryService.createHistory(dataHistorical, transaction);

            await transaction.commit();
            info("RELEASE SERIALS", "SERIAL RELEASED!", bulkSerial);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'released',
                    data: null,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();
            await errorLog("RELEASE SERIALS", error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: null
                })
        }
    }
}

module.exports = new ReleaseController()
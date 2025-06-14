const { sequelize, Sequelize } = require('../../models');
const { TransferService, InventoryService, InventoryRequestService } = require('../Services/ServiceContainer');
const moment = require('moment');
const {Authentication} = require('../../helper/helper')
const {v4: uuidv4} = require('uuid');
const { error } = require('../../helper/Logging');

class TransferController {
    findDataTransfer = (req, res) => {
        TransferService.findDataTransfer(req.params.transfer_code)
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

    storeDataTransferViaIr = async (req, res) => {
        let transaction = await sequelize.transaction();

        try {
            let [dataLocation, dataSerialNumber] = await Promise.all([
                InventoryService.findDataLocation(req.body.location_id, req.body.partnumber),
                InventoryService.findSerialNumber(req.body.qrbarcode, transaction)
            ])

            let [ result ] = await Promise.all([
                TransferService.storeUniqueTransfer(req.body.location_id, req.body.sublocation_id, req.body.qrbarcode, req.body.detail_transfer_oid),
                InventoryService.transferSerial(
                    dataSerialNumber.dataValues.invcd_oid,
                    {
                        qty: 1,
                        location_id: body.location_id,
                        sublocation_id: req.body.sublocation_id,
                        inventory_oid: dataLocation.dataValues.invc_oid,
                        transaction_code: null,
                        transaction_oid: null,
                        status: Sequelize.literal(`CASE WHEN invcd_invc_oid IS NULL THEN 'registered' ELSE available END`),
                    },
                    Authentication.user().usernama,
                    transaction
                ),
                InventoryService.createHistory([{
                    invcdh_oid: uuidv4(),
                    invcdh_dom_id: 1,
                    invcdh_en_id: dataSerialNumber.dataValues.invcd_en_id,
                    invcdh_pt_id: dataSerialNumber.dataValues.invcd_pt_id,
                    invcdh_loc_from_id: dataSerialNumber.dataValues.invcd_loc_id,
                    invcdh_locs_from_id: dataSerialNumber.dataValues.invcd_locs_id,
                    invcdh_loc_to_id: req.body.location_id,
                    invcdh_locs_to_id: req.body.sublocation_id,
                    invcdh_qrbarcode: req.body.qrbarcode,
                    invcdh_status: 'transfer!',
                    invcdh_remarks: 'transfer inventory request',
                    invcdh_created_by: Authentication.user().usernama,
                    invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
                }], transaction)
            ])

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
}

module.exports = new TransferController();
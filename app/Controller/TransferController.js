const { sequelize, Sequelize } = require('../../models');
const { TransferService, InventoryService, InventoryRequestService } = require('../Services/ServiceContainer');
const moment = require('moment');
const {Authentication} = require('../../helper/helper')
const {v4: uuidv4} = require('uuid');
const { error: errorLog } = require('../../helper/Logging');

class TransferController {
    findDataTransfer = async (req, res) => {
        Promise.all([
            TransferService.findDataTransfer(req.params.transfer_code),
            TransferService.countSerialTransfer(req.params.transfer_code)
        ])
        .then(([result, totalScanned]) => {
            if (result) {
                result.dataValues.total_scanned = totalScanned;
            }

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
            let [dataSerialNumber, dataDetailTransfer, serialTransfer, dataSubLocation] = await Promise.all([
                InventoryService.findSerialNumber(req.body.qrbarcode, transaction),
                TransferService.findDetailTransferByHeaderOid(req.body.transfer_oid, req.body.qrbarcode),
                TransferService.findSerialTransfer(req.body.transfer_oid, req.body.qrbarcode),
                InventoryService.findSublocation(req.body.sublocation_id)
            ])

            let qtyInSubLocation = parseInt(dataSubLocation.dataValues.qty);
            let capacitySubLocation = parseInt(dataSubLocation.dataValues.capacity);
            let qtyInDetailTransfer = parseInt(dataDetailTransfer.dataValues.total_receipt_serial);
            let limitDetailTransfer = dataDetailTransfer.dataValues.qty;

            if (!dataSerialNumber) {
                await transaction.rollback();

                res.status(300)
                    .json({
                        status: 'failed',
                        message: 'error',
                        data: null,
                        error: 'Serial number does not exist'
                    });

                return;
            }

            if (serialTransfer) {
                await transaction.rollback();

                res.status(300)
                    .json({
                        status: 'failed',
                        message: 'error',
                        data: null,
                        error: 'Serial number already exists in transfer'
                    });

                return;
            }

            if (qtyInDetailTransfer + 1 > limitDetailTransfer) {
                await transaction.rollback();

                res.status(300)
                    .json({
                        status: 'failed',
                        message: 'error',
                        data: null,
                        error: 'Exceeded transfer quantity limit'
                    });

                return;
            }

            if (qtyInSubLocation + qtyInDetailTransfer + 1 > capacitySubLocation) {
                await transaction.rollback();

                res.status(300)
                    .json({
                        status: 'failed',
                        message: 'error',
                        data: null,
                        error: 'Exceeded the capacity'
                    });

                return;
            }

            let result = await TransferService.storeUniqueTransfer(
                    req.body.location_id, 
                    req.body.sublocation_id, 
                    req.body.qrbarcode, 
                    dataDetailTransfer.dataValues.ptsfrd_oid,
                    transaction
                );

            await transaction.commit();

            res.status(200)
                .json({
                    status: 'success',
                    message: 'created',
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

    applyTransfer = async (req, res) => {
        let transaction = await sequelize.transaction();

        try {
            let AuthUser = Authentication.user();
            let headerTransferOid = req.params.header_transfer_oid;
            let dataSerialTransfer = await TransferService.retrieveSerialTransfer(headerTransferOid);
            let historyTransfer = [];

            for (const singularSerialTransfer of dataSerialTransfer) {
                let dataTransferSerial = singularSerialTransfer.dataValues;
                let inventoryDetailOid = dataTransferSerial.invcd_oid;
                let invetoryOidValueConditionWhenInventoryOidIsNull = Sequelize.literal(`CASE WHEN invcd_invc_oid IS NOT NULL THEN '${dataTransferSerial.invc_oid}'::uuid ELSE NULL END`);
                let statusValueConditionWhenInventoryOidIsNull = Sequelize.literal(`CASE WHEN invcd_invc_oid IS NOT NULL THEN 'available' ELSE 'registered' END`);
                let bodyTransfer = {
                    qty: 1,
                    location_id: dataTransferSerial.transfer_location_id,
                    sublocation_id: dataTransferSerial.transfer_sublocation_id,
                    inventory_oid: invetoryOidValueConditionWhenInventoryOidIsNull,
                    transaction_code: null,
                    transaction_oid: null,
                    status: statusValueConditionWhenInventoryOidIsNull,
                    booked: null
                }

                // apply transfering serial
                InventoryService.transferSerial( inventoryDetailOid, bodyTransfer, AuthUser.usernama, transaction);

                // push data history
                historyTransfer.push({
                        invcdh_oid: uuidv4(),
                        invcdh_dom_id: 1,
                        invcdh_en_id: dataTransferSerial.entity_id,
                        invcdh_pt_id: dataTransferSerial.product_id,
                        invcdh_loc_from_id: dataTransferSerial.source_location_id,
                        invcdh_locs_from_id: dataTransferSerial.source_sublocation_id,
                        invcdh_loc_to_id: dataTransferSerial.transfer_location_id,
                        invcdh_locs_to_id: dataTransferSerial.transfer_sublocation_id,
                        invcdh_qrbarcode: dataTransferSerial.transfer_qrbarcode,
                        invcdh_status: 'transfer!',
                        invcdh_remarks: 'transfer inventory request',
                        invcdh_created_by: Authentication.user().usernama,
                        invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        invcdh_transaction_oid: dataTransferSerial.master_transfer_oid,
                        invcdh_transaction_code: dataTransferSerial.master_transfer_code
                    });
            }

            // insert history transfer
            await InventoryService.createHistory(historyTransfer, transaction)

            await transaction.commit()

            res.status(200)
                .json({
                    status: 'success',
                    message: 'applied transfer',
                    data: true,
                    error: null
                })
        } catch (error) {
            await transaction.rollback()
            await errorLog('APPLY TRANSFER', error.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    deleteDataSerial = (req, res) => {
        TransferService.deleteSerialTransfer(req.params.serial_transfer_oid)
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

module.exports = new TransferController();
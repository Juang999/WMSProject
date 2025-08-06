const { InventoryRequestService, InventoryService } = require('../Services/ServiceContainer');
const { sequelize, Sequelize } = require('../../models');
const moment = require('moment');
const {Authentication} = require('../../helper/helper')
const {v4: uuidv4} = require('uuid');

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
        InventoryRequestService.findHeaderInventoryReceipt(req.params.inventory_request_code)
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
            let [dataSerialNumber, dataSerialInventoryRequest, dataDetailInventoryRequest] = await Promise.all([
                InventoryService.findSerialNumber(req.body.unique, transaction),
                InventoryRequestService.findSerialInventoryRequest(req.body.unique, req.body.detail_inventory_request_oid),
                InventoryRequestService.findDataDetail(req.body.detail_inventory_request_oid),
            ]);

            if (!dataDetailInventoryRequest) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'partnumber not found',
                        data: null,
                        error: 'partnumber not found'
                    });
                
                return;
            }

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

            if (dataSerialNumber.dataValues.invcd_transaction_oid != null && dataSerialNumber.dataValues.invcd_transaction_code != null) {
                res.status(404)
                .json({
                    status: 'bookked',
                    message: 'serial already booked into another transaction',
                    data: null,
                    error: 'serial already booked into another transaction'
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

            let totalSerial = await InventoryRequestService.countSerial(dataDetailInventoryRequest.dataValues.pbd_oid);

            if (totalSerial + 1 > dataDetailInventoryRequest.dataValues.pbd_qty) {
                res.status(300)
                    .json({
                        status: 'exceeding limit',
                        message: 'exceeding limit',
                        data: null,
                        error: 'exceeding limit'
                    });

                return;
            }

            // if (dataSerialNumber.dataValues.invcd_status != 'available') {
            //     if (dataSerialNumber.dataValues.invcd_status == 'registered') {
            //         res.status(300)
            //             .json({
            //                 status: 'the serial has not been adjusted yet',
            //                 message: 'the serial has not been adjusted yet',
            //                 data: null,
            //                 error: null
            //             });
            //         return;
            //     } else {
            //         res.status(300)
            //             .json({
            //                 status: `serial is ${dataSerialNumber.dataValues.invcd_status}`,
            //                 message: `serial is ${dataSerialNumber.dataValues.invcd_status}`,
            //                 data: null,
            //                 error: null
            //             })
            //         return;
            //     }
            // }

            let dataSubLocation = await InventoryService.findSublocationTransferByLocation(dataSerialNumber.dataValues.invcd_en_id);

            let [ result ] = await Promise.all([
                InventoryRequestService.storeSerialInventoryRequest(
                    dataSerialNumber.dataValues,
                    dataSubLocation.dataValues,
                    req.body.detail_inventory_request_oid, 
                    Authentication.user().usernama, 
                    transaction
                ),
                InventoryService.transferSerial(
                    dataSerialNumber.dataValues.invcd_oid, 
                    {
                        qty: (dataDetailInventoryRequest.dataValues.pbt_code == 'GIFTSPL') ? 0 : 1,
                        location_id: dataSubLocation.dataValues.locs_loc_id,
                        sublocation_id: dataSubLocation.dataValues.locs_id,
                        inventory_oid: Sequelize.literal("invcd_invc_oid"),
                        transaction_code: dataDetailInventoryRequest.dataValues.pb_code,
                        transaction_oid: dataDetailInventoryRequest.dataValues.pb_oid,
                        status: 'shipped',
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
                        invcdh_loc_to_id: dataSubLocation.dataValues.locs_loc_id,
                        invcdh_locs_to_id: dataSubLocation.dataValues.locs_id,
                        invcdh_qrbarcode: dataSerialNumber.dataValues.uniq,
                        invcdh_status: 'mutasi!',
                        invcdh_remarks: 'mutasi inventory request',
                        invcdh_created_by: Authentication.user().usernama,
                        invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
                    }], 
                    transaction
                )
            ])

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
        sequelize.transaction(async t => {
            let inventoryRequestDataSerial = await InventoryRequestService.findSerialInventoryRequestByOid(req.params.serial_inventory_request_oid);


            let [ result ] = await Promise.all([
                InventoryRequestService.deleteSerial(req.params.serial_inventory_request_oid, t),
                InventoryService.updateSerial(inventoryRequestDataSerial.dataValues.invcd_oid, 
                    {
                        location_id: inventoryRequestDataSerial.dataValues.pbds_loc_id,
                        sublocation_id: inventoryRequestDataSerial.dataValues.pbds_locs_id,
                        serial_number: Sequelize.literal(`invcd_qrbarcode`)
                    }, 
                    Authentication.user().usernama, t),
                InventoryService.createHistory([{
                        invcdh_oid: uuidv4(),
                        invcdh_dom_id: 1,
                        invcdh_en_id: inventoryRequestDataSerial.dataValues.entity_id,
                        invcdh_pt_id: inventoryRequestDataSerial.dataValues.pbds_pt_id,
                        invcdh_loc_from_id: inventoryRequestDataSerial.dataValues.pbds_loc_git,
                        invcdh_locs_from_id: inventoryRequestDataSerial.dataValues.pbds_locs_git,
                        invcdh_loc_to_id: inventoryRequestDataSerial.dataValues.pbds_loc_id,
                        invcdh_locs_to_id: inventoryRequestDataSerial.dataValues.pbds_locs_id,
                        invcdh_qrbarcode: inventoryRequestDataSerial.dataValues.uniq,
                        invcdh_status: 'moved!',
                        invcdh_remarks: 'release inventory request',
                        invcdh_created_by: Authentication.user().usernama,
                        invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
                    }], t)
            ]);

            return result;
        })
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

    findSerialNumber = (req, res) => {
        sequelize.transaction(async t => {
            let result = await InventoryService.findSerialNumber(req.params.unique, t);

            return result;
        })
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

    searchHistoryNumber = (req, res) => {
        
    }
}

module.exports = new InventoryRequestController();
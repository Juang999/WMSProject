const { InventoryRequestService, InventoryService } = require('../Services/ServiceContainer');
const { sequelize, Sequelize } = require('../../models');
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

            let dataSubLocation = await InventoryService.findSublocationTransferByLocation(dataSerialNumber.dataValues.invcd_en_id);

            let [ result ] = await Promise.all([
                InventoryRequestService.storeSerialInventoryRequest(
                    dataSerialNumber.dataValues,
                    dataSubLocation.dataValues,
                    req.body.detail_inventory_request_oid, 
                    Authentication.user().usernama, 
                    transaction
                ),
                InventoryService.scanoutSerial(
                    dataSerialNumber.dataValues.invcd_oid,  
                    Authentication.user().usernama,
                    dataDetailInventoryRequest.dataValues.pb_oid,
                    transaction,
                    dataDetailInventoryRequest.dataValues.pb_code,
                    (dataDetailInventoryRequest.dataValues.pbt_code == 'GIFTSPL') ? 0 : 1
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
                        invcdh_status: 'moved!',
                        invcdh_remarks: 'inventory request',
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
                InventoryService.updateSerial(dataSerialNumber.dataValues.invcd_oid, 
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
                        invcdh_loc_to_id: dataSubLocation.dataValues.pbds_loc_id,
                        invcdh_locs_to_id: dataSubLocation.dataValues.pbds_locs_id,
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
}

module.exports = new InventoryRequestController();
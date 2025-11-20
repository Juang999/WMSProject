const { 
    InventoryService, 
    ShipmentService, SalesOrderService, 
    SalesQuotationService, JournalQueryService, 
} = require('../Services/ServiceContainer');
const { info, error: errorLog } = require('../../helper/Logging');
const moment = require('moment');
const { sequelize } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const TransactionCode = require('../../helper/TransactionCode');
const Auth = require('../../helper/auth');

class SalesOrderShipmentController {
    getAllShipmentHeader = async ( req, res ) => {
        try {
            let sortingType = ['ASC', 'DESC'];

            let params = {
                conditions: {
                    start_date: (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD') : moment().startOf('weeks').format('YYYY-MM-DD'),
                    end_date: (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD') : moment().endOf('weeks').format('YYYY-MM-DD'),
                    shipment_code: (req.query.shipment_code) ? req.query.shipment_code : '',
                },
                sort: {
                    date_sort: (sortingType.find(item => item == req.query.date_sort)) ? req.query.date_sort : 'DESC',
                }
            }

            let result = await ShipmentService.retrieveHeaderShipment( params );

            return res.status(200).json({
                status: 'SUCCESS',
                message: 'Successfully retrieved shipment headers',
                data: result,
                error: null
            });
        } catch (error) {
            await errorLog('GET HEADER SALES ORDER SHIPMENT', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    getDetailShipment = async ( req, res ) => {
        try {
            let headerShipmentOid = req.params.header_shipment_oid;

            let [ data_detail, serial_number ] = await Promise.all([
                ShipmentService.retrieveDetailShipmentByOid( headerShipmentOid ),
                ShipmentService.retrieveSerialShipmentByOid( headerShipmentOid )
            ]);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: {data_detail, serial_number},
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SALES ORDER SHIPMENT', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    getAllDataSalesOrder = async ( req, res ) => {
        try {
            let entityId = req.params.entity_id;
            let search = req.query.saerch || '';
            let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD') : moment().startOf('months').format('YYYY-MM-DD');
            let endDate = (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD') : moment().endOf('months').format('YYYY-MM-DD');

            let result = await SalesOrderService.retrieveSalesOrderNumber(entityId, search, startDate, endDate);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET ALL DATA SALES ORDER', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error'
                })
        }
    }

    getDetailSalesOrderForShipment = async ( req, res ) => {
        try {
            let salesOrderOid = req.params.sales_order_oid;

            let result = await SalesOrderService.retrieveSalesOrderForShipment(salesOrderOid);
            result.dataValues.serial_number = await SalesOrderService.retrieveSerialNumberSalesOrder(salesOrderOid);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SALES ORDER FOR SHIPMENT', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error'
                })
        }
    }

    createShipment = async ( req, res ) => {
        const transaction = await sequelize.transaction();
        let token = req.headers['authorization'].split(" ")[1];
        let dataUser = Auth.user(token);

        try {
            // START: insert data shipment
            let uuidHeader = uuidv4();
            let sequence = await ShipmentService.countHeaderShipmentMonthly();
            let codeHeader = await TransactionCode.generate('SS', req.body.entity_id, sequence);

            // -> START: insert data header shipment
            let bodyHeader = {
                header_shipment_oid: uuidHeader,
                domain_id: req.body.domain_id,
                entity_id: req.body.entity_id,
                shipment_code: codeHeader,
                shipment_date: req.body.date,
                so_oid: req.body.header_sales_order_oid,
                site_id: req.body.site_id,
                exchange_rate: req.body.exchange_rate,
                currency_id: req.body.currency_id
            }

            await Promise.all([
                ShipmentService.inputHeaderShipment(bodyHeader, dataUser, transaction),
                SalesOrderService.updateHeaderSalesOrder({
                    transaction_id: 'C',
                    close_date: moment().format('YYYY-MM-DD')
                }, req.body.header_sales_order_oid, transaction)
            ]);
            // -> END: insert data shipment

            // -> STAT: insert detail shipment
            let detailShipment = JSON.parse(req.body.detail_shipment);
            let {status, message, detail_shipment, data_gltdet} = await this.generateDetailShipment(detailShipment, dataUser, {
                header_shipment_oid: uuidHeader,
                header_shipment_code: codeHeader,
                entity_id: req.body.entity_id
            }, transaction);

            if (status == false) {
                await transaction.rollback();

                res.status(400)
                    .json({
                        status: 'bad request',
                        message: message,
                        data: null,
                        error: message
                    })

                return;
            }

            await Promise.all([
                JournalQueryService.insertGltDet(data_gltdet, transaction),
                ShipmentService.inputDetailShipment(detail_shipment, transaction),
            ]);
            // -> END: insert detial shipment

            // -> START: insert serial shipment
            let {data_serial_shipment, data_serial} = await this.generateSerialShipment(detail_shipment, req.body.header_sales_order_oid);

            await Promise.all([
                ShipmentService.inputSerialShipment(data_serial_shipment, transaction),
                InventoryService.bulkSerialsUpdate(data_serial, {
                    qty: 0,
                    transaction_code: codeHeader,
                    transaction_oid: uuidHeader,
                    status: 'shipped'
                }, transaction)
            ]);
            // -> END: insert serial shipment
            // END: insert data shipment

            await transaction.commit();

            info('SHIPMENT', `SHIPPED`, {shipment_code: codeHeader, shipped_by: dataUser.usernama});
            res.status(200)
                .json({
                    status: 'success',
                    message: 'created',
                    data: true,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();
            await errorLog('SHIPMENT', error.message);

            res.status(500)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    generateDetailShipment = async (bodyDetail, dataUser, additionalData, transaction) => {
        let result = {
            status: true,
            message: null,
            detail_shipment: [],
            data_gltdet: []
        }
        let detailSalesOrderOid = bodyDetail.map(item => item.detail_sales_order_oid);
        let getDetailSalesOrder = await SalesOrderService.retrieveDetailSalesOrder(detailSalesOrderOid);
        // sequence variable
        let sequence = 1;
        let sequenceGlt = 1;
        let totalGltMonthly = await JournalQueryService.countDataGltDetMonthly();
        let gltTransactionCode = await TransactionCode.generate('IC', additionalData.entity_id, totalGltMonthly);

        for (const singularDetailSalesOrder of bodyDetail) {
            let foundDataDetailSalesOrder = getDetailSalesOrder.find(({dataValues: item}) => item.sod_oid == singularDetailSalesOrder.detail_sales_order_oid);

            if (singularDetailSalesOrder.qty_shipment == 0 || singularDetailSalesOrder.qty_shipment == '' || singularDetailSalesOrder.qty_shipment == '-') {
                result.status = false;
                result.message = `Shipment can't be 0`;

                break;
            }

            if (foundDataDetailSalesOrder) {
                let dataDetailSalesOrder = foundDataDetailSalesOrder.dataValues;

                await Promise.all([
                    SalesOrderService.updateQtyShipmentSalesOrder(dataDetailSalesOrder.sod_oid, singularDetailSalesOrder.qty_shipment, transaction),
                    SalesQuotationService.updateDataDetailSq(dataDetailSalesOrder.sod_sqd_oid, null, {qty_shipment: singularDetailSalesOrder.qty_shipment}, transaction)
                ]);

                let bodyDetailShipment = {
                    soshipd_oid: uuidv4(),
                    soshipd_soship_oid: additionalData.header_shipment_oid,
                    soshipd_sod_oid: dataDetailSalesOrder.sod_oid,
                    soshipd_seq: sequenceGlt,
                    soshipd_qty: -parseInt(singularDetailSalesOrder.qty_shipment),
                    soshipd_um: dataDetailSalesOrder.sod_um,
                    soshipd_um_conv: dataDetailSalesOrder.sod_um_conv,
                    soshipd_qty_real: -parseInt(singularDetailSalesOrder.qty_shipment),
                    soshipd_si_id: dataDetailSalesOrder.sod_si_id,
                    soshipd_loc_id: dataDetailSalesOrder.sod_loc_id,
                    soshipd_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
                }

                if (parseInt(singularDetailSalesOrder.qty_shipment) > 0) {
                    sequenceGlt += 1;

                    let {status_journal, message, data: dataDebit} = await this.jounalingShipment({
                        productline_id: dataDetailSalesOrder.productline_id,
                        cost: dataDetailSalesOrder.sod_cost,
                        qty_shipment: singularDetailSalesOrder.qty_shipment,
                        domain_id: dataDetailSalesOrder.sod_dom_id,
                        entity_id: dataDetailSalesOrder.sod_en_id,
                        currency_id: dataDetailSalesOrder.currency_id,
                        exchange_rate: dataDetailSalesOrder.exchange_rate,
                        transaction_code: gltTransactionCode
                    }, {
                        productline_account_code: 'SL_CMACC',
                        sequence: sequenceGlt,
                        header_shipment_oid: additionalData.header_shipment_oid,
                        header_shipment_code: additionalData.header_shipment_code,
                        usernama: dataUser.usernama,
                        date: moment().format('YYYY-MM-DD'),
                        request_sign: 'D',
                        entity_id: dataDetailSalesOrder.sod_en_id,
                        transaction: transaction
                    });

                    if (status_journal == false) {
                        result.status = false;
                        result.message = message;

                        break;
                    }

                    result.data_gltdet.push(dataDebit);
                }

                sequenceGlt += 1;

                let {status_journal, message, data: dataCredit} = await this.jounalingShipment({
                    productline_id: dataDetailSalesOrder.productline_id,
                    cost: dataDetailSalesOrder.sod_cost,
                    qty_shipment: singularDetailSalesOrder.qty_shipment,
                    domain_id: dataDetailSalesOrder.sod_dom_id,
                    entity_id: dataDetailSalesOrder.sod_en_id,
                    currency_id: dataDetailSalesOrder.currency_id,
                    exchange_rate: dataDetailSalesOrder.exchange_rate,
                    transaction_code: gltTransactionCode
                }, {
                    productline_account_code: 'INV_ACCT',
                    sequence: sequence,
                    header_shipment_oid: additionalData.header_shipment_oid,
                    header_shipment_code: additionalData.header_shipment_code,
                    usernama: dataUser.usernama,
                    date: moment().format('YYYY-MM-DD'),
                    request_sign: 'C',
                    entity_id: dataDetailSalesOrder.sod_en_id,
                    transaction: transaction
                })

                if (status_journal == false) {
                    result.status = false;
                    result.message = message;

                    break;
                }

                result.data_gltdet.push(dataCredit);
                result.detail_shipment.push(bodyDetailShipment);
                sequence += 1;
            }
        }

        return result;
    }

    generateSerialShipment = async ( bodyDetail, headerSalesOrderOid ) => {
        let result = {
            data_serial_shipment: [],
            data_serial: []
        };
        let sequence = 1;
        let serialsSalesOrder = bodyDetail.map(item => item.detail_sales_order_oid);
        let dataSerialSalesOrder = await SalesOrderService.retrieveSerialNumberSalesOrder( headerSalesOrderOid );
        
        for (const {dataValues: singularSerialSalesOrder} of dataSerialSalesOrder) {
            let dataDetail = bodyDetail.find(item => item.soshipd_sod_oid == singularSerialSalesOrder.sods_sod_oid);

            let serialShipment = {
                soshipds_oid: uuidv4(),
                soshipds_soshipd_oid: dataDetail.soshipd_oid,
                soshipds_seq: sequence,
                soshipds_qty: 1,
                soshipds_qty_real: 1,
                soshipds_si_id: singularSerialSalesOrder.sod_si_id,
                soshipds_loc_id: singularSerialSalesOrder.sods_loc_id,
                soshipds_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
                soshipds_qrbarcode: singularSerialSalesOrder.qrbarcode,
                soshipds_sod_oid: singularSerialSalesOrder.sods_sod_oid
            }

            result.data_serial_shipment.push(serialShipment);
            result.data_serial.push(singularSerialSalesOrder.qrbarcode);
            sequence += 1;
        }

        return result;
    } 

    jounalingShipment = async (dataShipment, additionalData) => {
        let result = {
            status_journal: true,
            message: null,
            data: {}
        }

        let {status: statusProductLine, message: messageProductLine, data: dataProductLine} = await JournalQueryService.retrieveProdLineAccount(dataShipment.productline_id, additionalData.productline_account_code);

        if (statusProductLine == false) {
            result.status_journal = false;
            result.message = messageProductLine;
            return;
        }

        // Cost
        const totalCost = parseInt(dataShipment.cost) * parseInt(dataShipment.qty_shipment);

        // Creating data history: public.glt_det;
        result.data = {
                glt_oid: uuidv4(),
                glt_dom_id: dataShipment.domain_id,
                glt_en_id: dataShipment.entity_id,
                glt_add_by: additionalData.usernama,
                glt_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                glt_code: dataShipment.transaction_code,
                glt_date: moment().format('YYYY-MM-DD'),
                glt_type: 'IC',
                glt_cu_id: dataShipment.currency_id,
                glt_exc_rate: dataShipment.exchange_rate,
                glt_seq: additionalData.sequence,
                glt_ac_id: dataProductLine.dataValues.account_id,
                glt_sb_id: dataProductLine.dataValues.subaccount_id,
                glt_cc_id: dataProductLine.dataValues.cost_center_id,
                glt_desc: 'SO Shipment',
                glt_debit: (additionalData.request_sign == 'D') ? totalCost : 0, 
                glt_credit: (additionalData.request_sign == 'C') ? totalCost : 0,
                glt_ref_oid: additionalData.header_shipment_oid,
                glt_ref_trans_code: additionalData.header_shipment_code,
                glt_posted: 'N',
                glt_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
                glt_daybook: 'IC-SOS'
            }

        let {status: statusUpdateBalance, message: messageUpdateBalance} = await JournalQueryService.updateGlobalBalance({
            account_sign: dataProductLine.dataValues.account_sign,
            account_id: dataProductLine.dataValues.account_id,
            subaccount_id: dataProductLine.dataValues.subaccount_id,
            cost_center_id: dataProductLine.dataValues.cost_center_id,
            cost: totalCost
        }, {
            usernama: additionalData.usernama,
            date: additionalData.date,
            request_sign: additionalData.request_sign,
            entity_id: additionalData.entity_id,
        }, additionalData.transaction);

        if (statusUpdateBalance == false) {
            result.status_journal = false;
            result.message = messageUpdateBalance;
            result.data = {};

            return result;
        }

        return result;
    }
}

module.exports = new SalesOrderShipmentController();
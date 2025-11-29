const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const Auth = require('../../helper/auth');
const { sequelize, Sequelize } = require('../../models');
const { Server } = require('../../helper/helper');
const Bilangan = require('../../helper/Bilangan');
const { info, error: errorLog } = require('../../helper/Logging');
const { 
    InventoryService,
    PriceService, ProductService,
    PartnerService, PurchaseOrderService, 
    SalesQuotationService, PackageService, 
} = require('../Services/ServiceContainer');
const { messageSend } = require('../../helper/TelegramBot');

class SalesQuotationController {
    getHEaderSalesQuotationByEntity = async ( req, res ) => {
        try {
            let entityId = req.params.entity_id;
            let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            let endDate = (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            let sqCode = req.query.sq_code || '';

            let result = await SalesQuotationService.retrieveHeaderSalesQuotationByEntity({
                entity_id: entityId,
                start_date: startDate,
                end_date: endDate,
                sq_code: sqCode
            });

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET HEADER SALES QUOTATION BY ENTITY', error.message);

            res.status(500)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    getHeaderSalesQuotationByDate = async ( req, res ) => {
        try {
            let params = {
                conditions: {
                    start_date: req.query.start_date || moment().startOf('months').format('YYYY-MM-DD'),
                    end_date: req.query.end_date || moment().endOf('months').format('YYYY-MM-DD'),
                    sales_quotation_code: req.query.sq_code || ''
                },
                sort: {
                    date: req.query.date_sort || 'DESC'
                }
            }

            let result = await SalesQuotationService.retrieveSalesQuotation( params );

            res.status(200)
                .json({
                    statu: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET HEADER SALES QUOTATION BY DATE', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    getDetailSalesQuotation = async ( req, res ) => {
        try {
            let headerSalesQuotationOid = req.params.header_sales_quotation_oid;

            let result = await SalesQuotationService.retrieveDetailSalesQuotation( headerSalesQuotationOid );

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SALES QUOTATION', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    getSalesQuotationType = async ( req, res ) => {
        try {
            let result = [
                {
                    id: "R",
                    name: "Regular"
                }, {
                    id: "P",
                    name: "Personal Selling"
                }, {
                    id: "D",
                    name: "Direct Selling"
                }
            ];

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog("GET SALES QUOTATION TYPE", error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    getPackage = async ( req, res ) => {
        try {
            let entityId = req.params.entity_id;

            let result = await PackageService.retrieveHeaderPackage( entityId );

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET PACKAGE SALES QUOTATION', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error'
                })
        }
    }

    createSalesQuotation = async ( req, res ) => {
        let token = req.headers['authorization'].split(" ")[1];
        let dataUser = Auth.user(token);

        let transaction = await sequelize.transaction();

        try {
            let bodyHeader = req.body
            let salesQuotationOid = uuidv4();
            let groceries = JSON.parse(req.body.groceries);
            let foundSalesQuotation = (req.body.is_rebooking == 'N') ? null : await SalesQuotationService.findSalesQuotation(req.body.rebook_sales_quotation_oid);
            let foundPartnerDropship = (req.body.is_dropship == 'N') ? null : await PartnerService.findPartnerById(req.body.dropship_partner_id);
            let foundPurchaseOrder = (req.body.po_customer_reff == '') ? null : await PurchaseOrderService.findPurchaseOrderByOid(req.body.purchase_order_oid);

            let totalPrice = this.generateTotalPrice( groceries );

            let data_header = await this.generateHeaderSalesQuotation(bodyHeader, dataUser, groceries, {
                sq_oid: salesQuotationOid,
                data_purchase_order: foundPurchaseOrder,
                data_sales_quotation: foundSalesQuotation,
                data_dropship: foundPartnerDropship,
                total_price: totalPrice
            });

            let {status, message, data_product, data_detail} = await this.generateDetailSalesQuotation( groceries, dataUser, {
                entity_id: req.body.entity_id,
                sales_quotation_oid: salesQuotationOid,
                account_id: req.body.account_id,
                subaccount_id: req.body.subaccount_id,
                cost_center_id: req.body.cost_center_id,
                location_id: req.body.origin_location_id,
                is_booking: req.body.is_booking,
                transaction: transaction
            });

            if (status == false) {
                await transaction.rollback();

                res.status(300)
                    .json({
                        status: 'failed',
                        message: message,
                        data: data_product,
                        error: null
                    });

                return;
            }

            await SalesQuotationService.inputHeaderSalesQuotation([data_header], transaction);
            await SalesQuotationService.inputDetailSalesQuotation(data_detail, transaction);

            await transaction.commit();

            res.status(200)
                .json({
                    status: 'success',
                    message: 'salse quotation created!',
                    data: true,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();
            await errorLog('CREATE SALES QUOTATION', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                });
        }
    }

    getDetailSalesQuotationForUpdate = async ( req, res ) => {
        try {
            let salesQuotationOid = req.params.sales_quotation_oid;

            let result = await SalesQuotationService.retrieveDetailForUpdate(salesQuotationOid);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SALES QUOTATION', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error'
                })
        }
    }

    updateHeaderSalesQuotation = async ( req, res ) => {
        const transaction = await sequelize.transaction();
        const headerSalesQuotationOId = req.params.header_sq_oid;
        let token = req.headers['authorization'].split(" ")[1];
        let dataUser = Auth.user(token);
        let dataPo = null;

        if (req.body.po_customer_reff != null || req.body.po_customer_reff != '' || req.body.po_customer_reff != '-') {
            dataPo = await PurchaseOrderService.findHeaderPurchaseOrderByCode(req.body.po_customer_reff);
        }

        try {
            let dataUpdate = {
                date: req.body.date,
                sales_person_id: req.body.sales_person_id,
                account_id: req.body.account_id,
                subaccount_id: req.body.subaccount_id,
                cost_center_id: req.body.cost_center_id,
                approval_id: req.body.approval_id,
                destination_location_id: req.body.destination_location_id,
                git_location_id: req.body.git_location_id,
                pricelist_area_id: req.body.pricelist_area_id,
                credit_terms_id: req.body.credit_terms_id,
                need_date: req.body.need_date,
                payment_method_id: req.body.payment_method_id,
                is_consigment: req.body.is_consigment,
                po_code: (dataPo != null) ? dataPo.dataValues.po_code : null,
                po_oid: (dataPo != null) ? dataPo.dataValues.po_oid : null
            };

            await SalesQuotationService.updateDataHeaderSq(headerSalesQuotationOId, dataUser, dataUpdate, transaction);
            await transaction.commit();

            res.status(200)
                .json({
                    status: 'success',
                    message: 'SQ Updated',
                    data: true,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();
            await errorLog(`UPDATE HEADER SALES QUOTATION`, error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    cancelSalesQuotation = async (req, res) => {
        const transaction = await sequelize.transaction();
        const headerSalesQuotationOId = req.params.header_sq_oid;
        let token = req.headers['authorization'].split(" ")[1];
        let dataUser = Auth.user(token);

        try {
            let dataHeaderSalesQuotation = await SalesQuotationService.retrieveStatusSalesQuotationHeader( headerSalesQuotationOId );

            if (dataHeaderSalesQuotation == null) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'SQ not found',
                        data: null,
                        error: 'SQ not found'
                    })

                return;
            }

            if (dataHeaderSalesQuotation.dataValues.sq_trans_id == 'X') {
                res.status(300)
                    .json({
                        status: 'rejected',
                        message: 'SQ has been cancel',
                        data: null,
                        error: 'SQ has been cancel'
                    })

                return;
            }

            if (dataHeaderSalesQuotation.dataValues.sq_booking == 'Y') {
                let detailSalesQuotation = await SalesQuotationService.retrieveDetailSalesQuotation( headerSalesQuotationOId );
                for (const {dataValues: singularDetailSalesQuotation} of detailSalesQuotation) {
                    let locationId = singularDetailSalesQuotation.location_id;
                    let productId = singularDetailSalesQuotation.product_id;
                    let quantity = parseInt(singularDetailSalesQuotation.qty);
                    let inventoryOid = singularDetailSalesQuotation.inventory_oid;
    
                    await Promise.all([
                        this.releaseInventory(inventoryOid, quantity, transaction),
                        this.releaseSerials(locationId, productId, quantity, transaction),
                    ])
                }
            }

            await SalesQuotationService.updateDataHeaderSq(headerSalesQuotationOId, dataUser, {
                transaction_status: 'X',
                close_date: moment().format('YYYY-MM-DD')
            }, transaction);

            await transaction.commit();

            res.status(200)
                .json({
                    status: 'success',
                    message: 'SQ has been cancel',
                    data: true,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();
            await errorLog(`CANCEL SALES QUOTATION`, error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    createDetailSalesQuotation = async ( req, res ) => {
        let transaction = await sequelize.transaction();
        let token = req.headers['authorization'].split(" ")[1];
        let dataUser = Auth.user(token);

        try {
            let groceries = JSON.parse(req.body.groceries);
            let [dataHeader, sequenceDetail] = await Promise.all([
                SalesQuotationService.retrieveStatusSalesQuotationHeader(req.body.header_sales_quotation_oid),
                SalesQuotationService.retrieveLastSequence(req.body.header_sales_quotation_oid)
            ]);

            let {status, message, data_product, data_detail} = await this.generateDetailSalesQuotation(groceries, dataUser, {
                transaction,
                entity_id: dataHeader.dataValues.sq_en_id,
                is_booking: dataHeader.dataValues.sq_booking,
                account_id: dataHeader.dataValues.sq_ar_ac_id,
                subaccount_id: dataHeader.dataValues.sq_ar_sb_id,
                cost_center_id: dataHeader.dataValues.sq_ar_cc_id,
                sales_quotation_oid: dataHeader.dataValues.sq_oid,
                location_id: dataHeader.dataValues.sq_ptsfr_loc_id,
                sequence: sequenceDetail.dataValues.last_sequence
            })

            if (status == false) {
            await transaction.rollback();

                res.status(300)
                    .json({
                        status: 'failed',
                        message: message,
                        data: data_product,
                        error: message
                    })

                return;
            }

            await SalesQuotationService.inputDetailSalesQuotation(data_detail, transaction);

            await transaction.commit();

            await this.updateTotalPriceSalesQuotation(dataHeader.dataValues.sq_oid, dataUser);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'detail created',
                    data: true,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();
            await errorLog('CREATE DETAIL SALES QUOTATION', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    updateDetailSalesQuotation = async ( req, res ) => {
        let transaction = await sequelize.transaction();
        let token = req.headers['authorization'].split(" ")[1];
        let dataUser = Auth.user(token);

        try {
            let detailSalesQuotationOid = req.params.detail_sales_quotation_oid;
            let productId = req.body.product_id;
            let locationId = req.body.location_id;
            let quantity = parseInt(req.body.qty);
            let price = parseInt(req.body.price);
            let discount = parseFloat(req.body.discount);
            let ppnType = req.body.ppn_type;
            let prePayment = req.body.prepayment;
            let payment = req.body.payment;
            let salesUnit = req.body.sales_unit;
    
            // START: mengambil data yang diperlukan
            let [foundDataDetail, totalSerialAvailable] = await Promise.all([
                SalesQuotationService.findDetailSqByOid(detailSalesQuotationOid),
                InventoryService.countSerialsOid(locationId, productId, null)
            ]);

            let headerSalesQuotation = await SalesQuotationService.retrieveStatusSalesQuotationHeader(foundDataDetail.dataValues.sqd_sq_oid);
            // END: mengambil data yang diperlukan

            // START: mengecek jumlah barang yang diperlukan
            if (quantity > totalSerialAvailable) {
                res.status(300)
                    .json({
                        status: 'failed',
                        message: `jumlah pemesanan melebihi stok tersedia! [tersedia: ${totalSerialAvailable}, pesananmu: ${quantity}]`,
                        data: null,
                        error: `jumlah pemesanan melebihi stok tersedia! [tersedia: ${totalSerialAvailable}, pesananmu: ${quantity}]`
                    })
    
                return;
            }
            // END: mengecek jumlah data yang diperlukan
    
            // START: booking stock jika SQ adalah booking
            let totalQuantity = null;
            let qtyNeeded = quantity;
            let qtyOrdered = parseInt(foundDataDetail.dataValues.qty);
    
            if (headerSalesQuotation.dataValues.sq_booking == 'Y') {
                if (qtyNeeded > qtyOrdered) {
                    // START: jika jumlah barang lebih dari jumlah yang sudah dipesan
                    totalQuantity = qtyNeeded - qtyOrdered;
    
                    await this.bookSerials(locationId, foundDataDetail.dataValues.product_id, totalQuantity, transaction);
                    await this.bookInventory(foundDataDetail.dataValues.inventory_oid, totalQuantity, transaction);
                    // END: jika jumlah barang lebih dari jumlah yang sudah dipesan
                } else if (qtyOrdered > qtyNeeded) {
                    // START: jika jumlah barang kurang dari jumlah yang sudah dipesan
                    totalQuantity = qtyOrdered - qtyNeeded;
                    
                    await this.releaseSerials(foundDataDetail.dataValues.location_id, foundDataDetail.dataValues.product_id, totalQuantity, transaction);
                    await this.releaseInventory(foundDataDetail.dataValues.inventory_oid, totalQuantity, transaction);
                    // END: jika jumlah barang kurang dari jumlah yang sudah ditentukan
                }
            }
            // END: booking stock jika SQ adalah booking

            // START: update detail SQ
            await SalesQuotationService.updateDataDetailSq(detailSalesQuotationOid, dataUser, {
                quantity,
                price,
                discount,
                ppn_type: ppnType,
                prepayment: prePayment,
                payment,
                sales_unit: salesUnit
            }, transaction);

            await transaction.commit();
            // END: update detail SQ

            // START: update header SQ
            await this.updateTotalPriceSalesQuotation(headerSalesQuotation.dataValues.sq_oid, dataUser);
            // END: update header SQ

            res.status(200)
                .json({
                    status: 'success',
                    message: 'updated',
                    data: true,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();
            await errorLog('UPDATE DETAIL SALES QUOTATION', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error'
                })
        }
    }

    deleteDetailSalesQuotation = async ( req, res ) => {
        let transaction = await sequelize.transaction();
        let token = req.headers['authorization'].split(" ")[1];
        let dataUser = Auth.user(token);

        try {
            let detailSalesQuotationOid = req.params.detail_salesquotation_oid;
            let dataDetailSalesQuotation = await SalesQuotationService.retrieveDetailSalesQuotationforDelete( detailSalesQuotationOid );

            if (dataDetailSalesQuotation == null) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'data not found',
                        data: null,
                        error: 'not found'
                    });

                return;
            }

            let {dataValues: getStatusHeaderSalesQuotation} = await SalesQuotationService.retrieveStatusSalesQuotationHeader( dataDetailSalesQuotation.dataValues.header_sales_quotation_oid );

            if (getStatusHeaderSalesQuotation.sq_trans_id == 'C') {
                res.status(300)
                    .json({
                        status: 'failed',
                        message: 'sales quotation already closed',
                        data: null,
                        error: 'sales quotation already closed'
                    })

                return;
            }

            let detailSq = dataDetailSalesQuotation.dataValues;

            // release booking
            await Promise.all([
                this.releaseInventory(detailSq.inventory_oid, detailSq.quantity, transaction),
                this.releaseSerials(detailSq.location_id, detailSq.product_id, detailSq.quantity, transaction),
                SalesQuotationService.deleteDetailSqByOid(detailSalesQuotationOid, transaction)
            ]);

            await transaction.commit();

            await this.updateTotalPriceSalesQuotation(detailSq.header_sales_quotation_oid, dataUser)

            res.status(200)
                .json({
                    status: 'success',
                    message: 'articel has been deleted!',
                    data: true,
                    error: null
                })
        } catch (error) {
            await transaction.rollback();
            await errorLog('DELETE PRODUCT SALES QUOTATION', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: 'Internal Server Error!'
                })
        }
    }

    generateHeaderSalesQuotation = async ( bodyHeader, dataUser, dataGroceries, additionalData ) => {
        let resultBody = {
                sq_oid: additionalData.sq_oid,
                sq_dom_id: 1,
                sq_en_id: bodyHeader.entity_id,
                sq_add_by: dataUser.usernama,
                sq_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                sq_code: await this.generateSalesQuotationCode( bodyHeader.entity_id ),
                sq_ptnr_id_sold: bodyHeader.customer_id,
                sq_ptnr_id_bill: bodyHeader.customer_id,
                sq_date: bodyHeader.date,
                sq_credit_term: bodyHeader.credit_terms_id,
                sq_si_id: bodyHeader.site_id,
                sq_type: bodyHeader.sq_type,
                sq_sales_person: bodyHeader.sales_person_id,
                sq_pi_id: bodyHeader.pricelist_id,
                sq_pay_type: bodyHeader.payment_type_id,
                sq_pay_method: bodyHeader.payment_method_id,
                sq_dp: bodyHeader.deposit,
                sq_total: additionalData.total_price,
                sq_tran_id: bodyHeader.approval_id,
                sq_trans_id: 'D',
                sq_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
                sq_cu_id: bodyHeader.currency_id,
                sq_total_ppn: 0,
                sq_total_pph: 0,
                sq_payment: 0,
                sq_exc_rate: bodyHeader.exchange_rate,
                sq_tax_inc: 'N',
                sq_cons: bodyHeader.is_consigment,
                sq_terbilang: Bilangan.parse( additionalData.total_price ),
                sq_interval: 1,
                sq_ref_po_code: (bodyHeader.po_customer_reff == '' || bodyHeader.po_customer_reff == null || bodyHeader.po_customer_reff == '-') ? null : bodyHeader.po_customer_reff,
                sq_ref_po_oid: (bodyHeader.po_customer_reff == '' || bodyHeader.po_customer_reff == null || bodyHeader.po_customer_reff == '-' && additionalData.data_purchase_order == null) ? null : additionalData.data_purchase_order.po_oid,
                sq_ppn_type: dataGroceries[0]['ppn_type'],
                sq_ar_ac_id: 13,
                sq_ar_sb_id: 0,
                sq_ar_cc_id: 0,
                sq_need_date: bodyHeader.need_date || moment().add(2, 'days').format('YYYY-MM-DD'),
                sq_is_package: (bodyHeader.is_package != null || bodyHeader.is_package != '' || bodyHeader.is_package != '-') ? 'Y' : 'N',
                sq_sales_program: bodyHeader.sales_program,
                sq_booking: bodyHeader.is_booking,
                sq_book_start_date: bodyHeader.start_date_booking,
                sq_book_end_date: bodyHeader.end_date_booking,
                sq_ptsfr_loc_id: bodyHeader.origin_location_id,
                sq_ptsfr_loc_to_id: bodyHeader.destination_location_id,
                sq_ptsfr_loc_git: bodyHeader.git_location_id,
                sq_en_to_id: bodyHeader.entity_id,
                sq_rebooking: bodyHeader.is_rebooking,
                sq_sq_ref_oid: (bodyHeader.is_rebooking == 'Y' && additionalData.data_sales_quotation) ? additionalData.data_sales_quotation.sq_oid : null,
                sq_sq_ref_code: (bodyHeader.is_rebooking == 'Y' && additionalData.data_sales_quotation) ? additionalData.data_sales_quotation.sq_code : null,
                sq_dropshipper: bodyHeader.is_dropship,
                sq_ship_to: (bodyHeader.is_dropship == 'Y' && additionalData.data_dropship) ? additionalData.data_dropship.ptnr_name : null,
                sq_pi_area_id: bodyHeader.pricelist_area_id,
                sq_ds_ptnr_id: (bodyHeader.is_dropship == 'Y') ? bodyHeader.dropship_partner_id : null,
            }

        return resultBody;
    }

    generateDetailSalesQuotation = async ( dataGroceries, dataUser, additionalData ) => {
        let status = null;
        let message = null;
        let disallowProduct = null;
        let dataDetail = [];
        let sequence = additionalData.sequence || 0;

        for (const dataGrocery of dataGroceries) {
            sequence += 1;

            if (dataGrocery.inventory_oid == null || dataGrocery.inventory_oid == '' || dataGrocery.inventory_oid == '-') {
                status = false;
                dataDetail = [];
                message = `inentory_oid null, segera hubungi akunting untuk adjustment atau segera lakukan release`;
                disallowProduct = await ProductService.retrieveDataProduct(dataGrocery.product_id);

                break;
            }

            let totalSerialAvailable = await InventoryService.countSerialsOid(additionalData.location_id, dataGrocery.product_id, null);

            if (dataGrocery.qty > totalSerialAvailable) {
                status = false;
                dataDetail = [];
                message = `jumlah pemesanan melebihi stok tersedia! [tersedia: ${totalSerialAvailable}, pesananmu: ${dataGrocery.qty}]`;
                disallowProduct = await ProductService.retrieveDataProduct(dataGrocery.product_id);

                break;
            }

            if (additionalData.is_booking == 'Y') {
                await Promise.all([
                    this.bookSerials(additionalData.location_id, dataGrocery.product_id, parseInt(dataGrocery.qty), additionalData.transaction),
                    this.bookInventory(dataGrocery.inventory_oid, parseInt(dataGrocery.qty), additionalData.transaction)
                ])
            }

            let detailItem = {
                sqd_oid: uuidv4(),
                sqd_dom_id: 1,
                sqd_en_id: additionalData.entity_id,
                sqd_add_by: dataUser.usernama,
                sqd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                sqd_sq_oid: additionalData.sales_quotation_oid,
                sqd_seq: sequence,
                sqd_is_additional_charge: (dataGrocery.additional_charge == "Y") ? dataGrocery.additional_charge : "N",
                sqd_si_id: 992,
                sqd_pt_id: dataGrocery.product_id,
                sqd_qty: dataGrocery.qty,
                sqd_qty_allocated: 0,
                sqd_um: 9964,
                sqd_cost: dataGrocery.cost,
                sqd_price: parseInt(dataGrocery.price),
                sqd_disc: parseFloat(dataGrocery.discount),
                sqd_sales_ac_id: additionalData.account_id,
                sqd_sales_sb_id: additionalData.subaccount_id,
                sqd_sales_cc_id: additionalData.cost_center_id,
                sqd_disc_ac_id: additionalData.account_id,
                sqd_um_conv: dataGrocery.um_conversion,
                sqd_qty_real: dataGrocery.qty,
                sqd_taxable: 'N',
                sqd_tax_inc: 'N',
                sqd_tax_class: 9949,
                sqd_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
                sqd_payment: dataGrocery.payment,
                sqd_dp: 0,
                sqd_sales_unit: 0,
                sqd_loc_id: additionalData.location_id,
                sqd_ppn_type: dataGrocery.ppn_type,
                sqd_invc_oid: dataGrocery.inventory_oid,
                sqd_qty_booking: additionalData.is_booking == 'Y' ? parseInt(dataGrocery.qty) : null,
            }

            dataDetail.push( detailItem );
        }

        return {
            status: (status == false) ? false : true,
            message: (message != null) ? message : null,
            data_product: disallowProduct,
            data_detail: dataDetail
        };
    }

    updateTotalPriceSalesQuotation = async ( headerSalesQuotationOId, dataUser ) => {
        let totalPrice = await SalesQuotationService.retrieveTotalPrice(headerSalesQuotationOId);

        let dataUpdate = {
            total_price: totalPrice[0]['dataValues']['total_price'],
            terbilang_harga: Bilangan.parse(totalPrice[0]['dataValues']['total_price'])
        };

        await SalesQuotationService.updateDataHeaderSq(headerSalesQuotationOId, dataUser, dataUpdate);
    }

    deleteOrderedProduct = async ( detailSalesQuotationOid, additionalData ) => {
        let {dataValues: foundDetailSq} = await SalesQuotationService.findDetailSqByOid( detailSalesQuotationOid );

        await Promise.all([
            this.releaseInventory(foundDetailSq.inventory_oid, foundDetailSq.qty, additionalData.transaction),
            this.releaseSerials(foundDetailSq.location_id, foundDetailSq.product_id, foundDetailSq.qty, additionalData.transaction)
        ]);

        await SalesQuotationService.deleteDetailSqByOid(detailSalesQuotationOid, additionalData.transaction);
    }

    generateSalesQuotationCode = async ( entityId ) => {
        let sqCode = 'SQ';
        let montlyId = '000';
        let baseSequence = '0000';
        let entityCode = `${entityId}0`;
        let yearPlusMonth = moment().format('YYMM');
        let serverCode = await Server.server(['server_code']);
        let sqSequence = await SalesQuotationService.countSalesQuotationInAMonth() + 1;
        let sequence = baseSequence.slice(0, -sqSequence.toString().length) + sqSequence;

        return sqCode + entityCode + yearPlusMonth + serverCode['server_code'] + montlyId + sequence;
    }

    generateTotalPrice = ( dataGroceries ) => {
        let totalPrice = 0;

        for (const dataGrocery of dataGroceries) {
            totalPrice += (parseInt(dataGrocery.price) * parseInt(dataGrocery.qty)) - (parseInt(parseInt(dataGrocery.price) * parseInt(dataGrocery.qty) * parseFloat(dataGrocery.discount)));
        }

        return totalPrice;
    }

    bookSerials = async ( locationId, productId, limit, transaction ) => {
        let dataSerials = await InventoryService.retrieveSerialsOidByLimit(locationId, productId, null, limit);
        let serialsOid = dataSerials.map(({dataValues: items}) => items.invcd_oid);

        await InventoryService.bulkSerialBooking(serialsOid, true, transaction);
    }

    bookInventory = async ( invcOid, qty, transaction ) => {
        await InventoryService.bookQuantityInventory(invcOid, {
            qty_available: Sequelize.literal(`invc_qty_available - ${qty}`),
            qty_booked: Sequelize.literal(`invc_qty_booked + ${qty}`)
        }, transaction);
    }

    releaseSerials = async ( locationId, productId, limit, transaction ) => {
        let dataSerials = await InventoryService.retrieveSerialsOidByLimit(locationId, productId, true, limit);
        let serialsOid = dataSerials.map(({dataValues: items}) => items.invcd_oid);

        await InventoryService.bulkSerialBooking(serialsOid, null, transaction);
    }

    releaseInventory = async ( invcOid, qty, transaction ) => {
        await InventoryService.bookQuantityInventory(invcOid, {
            qty_available: Sequelize.literal(`invc_qty_available + ${qty}`),
            qty_booked: Sequelize.literal(`invc_qty_booked - ${qty}`)
        }, transaction);
    }
}

module.exports = new SalesQuotationController();
const { 
    InvctTable,
    LocMstr, AcMstr,
    SbMstr, CcMstr,
    SqMstr, SqdDet, 
    SiMstr, PtnrMstr, 
    AreaMstr, EnMstr, 
    PiMstr, CodeMstr,
    CuMstr, PtnrgGrp,
    Sequelize, PsMstr,
    PtMstr, SlsProgram,
    DbgGroup, PtnraAddr,
} = require('../../models');
const { Op } = require('sequelize');
const moment = require('moment');

class SalesQuotationService {
    retrieveSalesQuotation = async ( params ) => {
        let { conditions, sort } = params;

        let result = await SqMstr.findAll({
            attributes: [
                'sq_oid', 
                [Sequelize.col(`entity_relation.en_desc`), 'entity'],
                ['sq_code', 'sq_number'],
                ['sq_need_date', 'effective_date'],
                'sq_type',
                [Sequelize.col(`site_relation.si_desc`), 'site'],
                [Sequelize.col('sold_to_relation.ptnr_name'), 'sold_to'],
                ['sq_ref_po_code', 'referensi_po_no'],
                [Sequelize.col(`sales_person_relation.ptnr_name`), 'sales_person'],
                [Sequelize.col('area_pricelist_relation.area_name'), 'area'],
                [Sequelize.col(`pricelist_relation.pi_desc`), 'price_list'],
                [Sequelize.col(`payment_type_relation.code_name`), 'payment_type'],
                [Sequelize.col(`credit_term_relation.code_name`), 'credit_term'],
                [Sequelize.col(`payment_method_relation.code_name`), 'payment_method'],
                ['sq_booking', 'booking'],
                ['sq_rebooking', 'rebooking'],
                ['sq_cons', 'consigment'],
                ['sq_alocated', 'pre_order'],
                ['sq_book_start_date', 'booking_date'],
                ['sq_book_end_date', 'expire_date'],
                ['sq_payment_date', 'payment_date'],
                ['sq_close_date', 'close_date'],
                ['sq_trans_id', 'status'],
                ['sq_trans_rmks', 'remarks'],
                ['sq_is_package', 'is_packagesq'],
                [Sequelize.col(`package_relation.ps_desc`), 'package_name'],
                ['sq_total', 'total'],
                ['sq_dropshipper', 'dropship'],
                ['sq_ship_to', 'ship_to'],
                ['sq_add_by', 'user_create'],
                ['sq_add_date', 'date_create'],
                ['sq_upd_by', 'user_update'],
                ['sq_upd_date', 'date_update']
            ],
            include: [
                {
                    model: EnMstr,
                    required: true,
                    as: 'entity_relation',
                    attributes: []
                }, {
                    model: DbgGroup,
                    as: 'grouping_relation',
                    attributes: []
                }, {
                    model: PsMstr,
                    as: 'package_relation',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    required: true,
                    as: 'sold_to_relation',
                    attributes: [],
                    include: [
                        {
                            model: PtnraAddr,
                            as: 'singular_partner_address_relation',
                            attributes: []
                        }, {
                            model: PtnrgGrp,
                            as: 'group_partner',
                            attributes: []
                        }
                    ]
                }, {
                    model: PtnrMstr,
                    required: true,
                    as: 'bill_to_relation',
                    attributes: []
                }, {
                    model: SiMstr,
                    required: true,
                    as: 'site_relation',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'origin_location',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location_git',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    required: true,
                    as: 'sales_person_relation',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'destination_location',
                    attributes: []
                }, {
                    model: PiMstr,
                    required: true,
                    as: 'pricelist_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    required: true,
                    as: 'payment_type_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    required: true,
                    as: 'payment_method_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'credit_term_relation',
                    attributes: []
                }, {
                    model: AcMstr,
                    required: true,
                    as: 'account_relation',
                    attributes: []
                }, {
                    model: SbMstr,
                    as: 'subaccount_relation',
                    attributes: []
                }, {
                    model: CcMstr,
                    as: 'cost_center_relation',
                    attributes: []
                }, {
                    model: CuMstr,
                    required: true,
                    as: 'currency_relation',
                    attributes: []
                }, {
                    model: SlsProgram,
                    as: 'sales_program_relation',
                    attributes: []
                }, {
                    model: AreaMstr,
                    as: 'area_pricelist_relation',
                    attributes: []
                }, 
            ],
            where: [
                Sequelize.where(Sequelize.literal(`DATE(sq_add_date)`), {
                    [Op.between]: [conditions.start_date, conditions.end_date]
                }),
                Sequelize.where(Sequelize.col(`sq_code`), {
                    [Op.iLike]: `%${conditions.sales_quotation_code}%`
                }),
            ],
            order: [
                ['sq_add_date', sort.date]
            ]
        });

        return result;
    }

    retrieveDetailSalesQuotation = async ( headerSalesQuotationOid ) => {
        let result = await SqdDet.findAll({
            attributes: [
                'sqd_oid',
                [Sequelize.col(`entity_relation.en_desc`), 'entity'],
                [Sequelize.col(`site_relation.si_desc`), 'site'],
                ['sqd_pt_id', 'product_id'],
                [Sequelize.col(`product_relation.pt_code`), 'part_number'],
                [Sequelize.col(`product_relation.pt_desc1`), 'description1'],
                [Sequelize.col(`product_relation.pt_desc2`), 'description2'],
                ['sqd_rmks', 'remarks'],
                [Sequelize.literal('ROUND(sqd_qty, 2)'), 'qty'],
                [Sequelize.literal('ROUND(sqd_qty_booking, 2)'), 'qty_booking'],
                [Sequelize.literal(`ROUND(sqd_qty_allocated, 2)`), 'qty_allocating'],
                [Sequelize.literal(`ROUND(sqd_qty_so, 2)`), 'qty_so'],
                [Sequelize.literal(`ROUND(sqd_qty_transfer, 2)`), 'qty_transfer'],
                [Sequelize.literal(`ROUND(sqd_qty_shipment, 2)`), 'qty_shipment'],
                [Sequelize.literal(`ROUND(sqd_qty - sqd_qty_so, 2)`), 'qty_outstanding'],
                [Sequelize.col(`unitmeasure_relation.code_name`), 'um'],
                ['sqd_loc_id', 'location_id'],
                [Sequelize.col(`location_relation.loc_desc`), 'location'],
                [Sequelize.literal('ROUND(sqd_cost, 2)'), 'cost'],
                [Sequelize.literal('ROUND(sqd_price, 2)'), 'price'],
                [Sequelize.literal(`CONCAT(ROUND(sqd_disc, 2), '%')`), 'discount'],
                [Sequelize.col(`account_relation.ac_code`), 'account_code'],
                [Sequelize.col(`account_relation.ac_name`), 'account_name'],
                [Sequelize.col(`subaccount_relation.sb_desc`), 'sub_account'],
                [Sequelize.col(`cost_center_relation.cc_desc`), 'cost_center'],
                [Sequelize.col(`account_relation.ac_code`), 'account_disc_code'],
                [Sequelize.col(`account_relation.ac_name`), 'account_disc_name'],
                [Sequelize.literal(`ROUND(sqd_um_conv, 2)`), 'um_conversion'],
                [Sequelize.literal(`ROUND(sqd_qty_real, 2)`), 'qty_real'],
                ['sqd_taxable', 'tax_include'],
                ['sqd_tax_inc', 'tax_include'],
                ['sqd_invc_oid', 'inventory_oid'],
                [Sequelize.col(`tax_class_relation.code_name`), 'tax_class'],
                ['sqd_ppn_type', 'ppn_type'],
                [Sequelize.literal(`ROUND(sqd_dp, 2)`), 'prepayment'],
                [Sequelize.literal(`ROUND(sqd_payment, 2)`), 'payment'],
                [Sequelize.literal(`ROUND(sqd_sales_unit, 2)`), 'sales_unit'],
                ['sqd_status', 'status']
            ],
            include: [
                {
                    model: EnMstr,
                    as: 'entity_relation',
                    attributes: []
                }, {
                    model: SiMstr,
                    as: 'site_relation',
                    attributes: []
                }, {
                    model: PtMstr,
                    as: 'product_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'unitmeasure_relation',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location_relation',
                    attributes: []
                }, {
                    model: AcMstr,
                    as: 'account_relation',
                    attributes: []
                }, {
                    model: SbMstr,
                    as: 'subaccount_relation',
                    attributes: []
                }, {
                    model: CcMstr,
                    as: 'cost_center_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'tax_class_relation',
                    attributes: []
                }
            ],
            where: {
                sqd_sq_oid: headerSalesQuotationOid
            }
        });

        return result;
    }

    findSalesQuotation = async ( salesQuotationOid ) => {
        let result = await SqMstr.findOne({
            attributes: ['sq_oid', 'sq_code'],
            where: {
                sq_oid: salesQuotationOid
            }
        });

        return result;
    }

    countSalesQuotationInAMonth = async () => {
        let startMonth = moment().startOf('month').format('YYYY-MM-DD');
        let endMonth = moment().endOf('month').format('YYYY-MM-DD');

        let result = await SqMstr.count({
            where: [
                Sequelize.where(Sequelize.literal(`DATE(sq_add_date)`), {
                    [Op.between]: [startMonth, endMonth]
                })
            ]
        });

        return result;
    }

    inputHeaderSalesQuotation = async ( dataBodyHeader, transaction ) => {
        await SqMstr.bulkCreate( dataBodyHeader, {
            transaction
        } )
    }

    inputDetailSalesQuotation = async ( dataBodyDetail, transaction ) => {
        await SqdDet.bulkCreate(dataBodyDetail, {
            transaction
        })
    }

    retrieveDetailForUpdate = async ( salesQuotationOid ) => {
        let result = await SqMstr.findOne({
            attributes: [
                'sq_oid',
                ['sq_en_id', 'entity_id'],
                [Sequelize.col(`entity_relation.en_desc`), 'entity_desc'],
                ['sq_si_id', 'site_id'],
                [Sequelize.col(`site_relation.si_desc`), 'site_desc'],
                ['sq_date', 'date'],
                ['sq_sales_person', 'sales_person_id'],
                [Sequelize.col(`sales_person_relation.ptnr_name`), 'sales_person'],
                ['sq_dp', 'deposit'],
                [`sq_ptnr_id_sold`, 'customer_id'],
                [Sequelize.literal(`sold_to_relation.ptnr_name`), 'customer_name'],
                ['sq_ar_ac_id', 'account_id'],
                [Sequelize.col('account_relation.ac_name'), 'account_desc'],
                ['sq_ar_sb_id', 'subaccount_id'],
                [Sequelize.col(`subaccount_relation.sb_desc`), 'subaccount_name'],
                ['sq_ar_cc_id', 'cost_center_id'],
                ['sq_booking', 'is_booking'],
                ['sq_book_start_date', 'start_date'],
                ['sq_book_end_date', 'end_date'],
                [Sequelize.col(`cost_center_relation.cc_desc`), 'cost_center_name'],
                ['sq_ptsfr_loc_id', 'origin_location_id'],
                [Sequelize.col(`origin_location.loc_desc`), 'origin_location_name'],
                ['sq_ptsfr_loc_git', 'git_location_id'],
                [Sequelize.col(`location_git.loc_desc`), 'git_location_name'],
                ['sq_ptsfr_loc_to_id', 'destination_location_id'],
                [Sequelize.col(`destination_location.loc_desc`), 'destination_location_name'],
                ['sq_pi_area_id', 'pricelist_area_id'],
                [Sequelize.col('area_pricelist_relation.area_name'), 'pricelist_area_name'],
                [Sequelize.literal(`CASE WHEN sq_type = 'R' THEN 'Regular' WHEN sq_type = 'P' THEN 'Personal Selling' WHEN sq_type = 'D' THEN 'Direct Selling' END`), 'type'],
                ['sq_credit_term', 'credit_term_id'],
                [Sequelize.col(`credit_term_relation.code_name`), 'credit_terms'],
                ['sq_pay_type', 'payment_type_id'],
                [Sequelize.col(`payment_type_relation.code_name`), 'payment_type'],
                ['sq_pay_method', 'payment_method_id'],
                [Sequelize.col(`payment_method_relation.code_name`), 'payment_method'],
                ['sq_need_date', 'need_date'],
                ['sq_due_date', 'due_date'],
                ['sq_trans_rmks', 'remarks'],
                [Sequelize.literal('ROUND(sq_total, 2)'), 'total_price'],
                ['sq_terbilang', 'terbilang']
            ],
            include: [
                {
                    model: EnMstr,
                    as: 'entity_relation',
                    attributes: []
                }, {
                    model: SiMstr,
                    as: 'site_relation',
                    attributes: []
                }, {
                    model: AcMstr,
                    as: 'account_relation',
                    attributes: []
                }, {
                    model: SbMstr,
                    as: 'subaccount_relation',
                    attributes: []
                }, {
                    model: CcMstr,
                    as: 'cost_center_relation',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'origin_location',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location_git',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'destination_location',
                    attributes: []
                }, {
                    model: AreaMstr,
                    as: 'area_pricelist_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'credit_term_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'payment_type_relation',
                    attributes: []
                }, {
                    model: CodeMstr,
                    as: 'payment_method_relation',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'sales_person_relation',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'sold_to_relation',
                    attributes: []
                }, {
                    model: SqdDet,
                    as: 'detail_sales_quotation_relation',
                    attributes: [
                        'sqd_oid',
                        'sqd_en_id',
                        [Sequelize.literal('"detail_sales_quotation_relation->entity_relation"."en_desc"'), 'entity_name'],
                        ['sqd_is_additional_charge', 'additional'],
                        ['sqd_pt_id', 'product_id'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->product_relation"."pt_desc1"`), 'description1'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->product_relation"."pt_desc2"`), 'description2'],
                        ['sqd_rmks', 'remarks'],
                        [Sequelize.literal(`ROUND(sqd_qty, 2)`), 'qty'],
                        ['sqd_um', 'um_id'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->unitmeasure_relation"."code_name"`), 'um'],
                        ['sqd_loc_id', 'location_id'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->location_relation"."loc_desc"`), 'location_name'],
                        [Sequelize.literal('ROUND(sqd_cost, 2)'), 'cost'],
                        [Sequelize.literal('ROUND(sqd_price, 2)'), 'price'],
                        [Sequelize.literal(`ROUND(sqd_disc, 2)`), 'discount'],
                        ['sqd_sales_ac_id', 'account_id'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->account_relation"."ac_code"`), 'account_code'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->account_relation"."ac_name"`), 'account_name'],
                        ['sqd_sales_sb_id', 'subaccount_id'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->subaccount_relation"."sb_desc"`), 'subaccount_name'],
                        ['sqd_sales_cc_id', 'cost_center_id'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->cost_center_relation"."cc_desc"`), 'cost_center_name'],
                        ['sqd_disc_ac_id', 'account_discount_id'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->account_disc_relation"."ac_code"`), 'account_disc_code'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->account_disc_relation"."ac_name"`), 'account_disc_name'],
                        [Sequelize.literal(`ROUND(sqd_um_conv, 2)`), 'um_conversion'],
                        [Sequelize.literal(`ROUND(sqd_qty_real, 2)`), 'qty_real'],
                        ['sqd_taxable', 'taxable'],
                        ['sqd_tax_inc', 'tax_include'],
                        [Sequelize.literal(`"detail_sales_quotation_relation->tax_class_relation"."code_name"`), 'tax_class'],
                        ['sqd_ppn_type', 'ppn_type'],
                        [Sequelize.literal(`ROUND(sqd_dp, 2)`), 'prepayment'],
                        [Sequelize.literal(`ROUND(sqd_payment, 2)`), 'payment'],
                        [Sequelize.literal(`ROUND(sqd_sales_unit, 2)`), 'sales_unit']
                    ],
                    include: [
                        {
                            model: EnMstr,
                            as: 'entity_relation',
                            attributes: []
                        }, {
                            model: PtMstr,
                            as: 'product_relation',
                            attributes: [],
                        }, {
                            model: CodeMstr,
                            as: 'unitmeasure_relation',
                            attributes: []
                        }, {
                            model: LocMstr,
                            as: 'location_relation',
                            attributes: []
                        }, {
                            model: AcMstr,
                            as: 'account_relation',
                            attributes: []
                        }, {
                            model: SbMstr,
                            as: 'subaccount_relation',
                            attributes: []
                        }, {
                            model: SbMstr,
                            as: 'subaccount_relation',
                            attributes: []
                        }, {
                            model: CcMstr,
                            as: 'cost_center_relation',
                            attributes: []
                        }, {
                            model: AcMstr,
                            as: 'account_disc_relation',
                            attributes: []
                        }, {
                            model: CodeMstr,
                            as: 'tax_class_relation',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                sq_oid: salesQuotationOid
            }
        });

        return result;
    }

    retrieveDetailSalesQuotationByHeaderoid = async ( headerSalesQuotationOid ) => {
        let result = await SqdDet.findAll({
            attributes: [
                ['sqd_oid', 'detail_sales_quotation_oid'],
                ['sqd_sq_oid', 'header_sales_quotation_oid'],
                ['sqd_pt_id', 'product_id'],
                ['sqd_loc_id', 'location_id'],
                ['sqd_invc_oid', 'inventory_oid'],
                [Sequelize.literal('CAST(sqd_qty AS INTEGER)'), 'quantity']
            ],
            where: {
                sqd_oid: {
                    [Op.in]: headerSalesQuotationOid
                }
            }
        });

        return result;
    }

    retrieveDetailSalesQuotationforDelete = async ( detailSalesQuotationOid ) => {
        let result = await SqdDet.findOne({
            attributes: [
                ['sqd_oid', 'detail_sales_quotation_oid'],
                ['sqd_sq_oid', 'header_sales_quotation_oid'],
                ['sqd_pt_id', 'product_id'],
                ['sqd_loc_id', 'location_id'],
                ['sqd_invc_oid', 'inventory_oid'],
                [Sequelize.literal('CAST(sqd_qty AS INTEGER)'), 'quantity'],
                [Sequelize.literal('CAST(sqd_price AS INTEGER)'), 'price'],
                [Sequelize.literal(`ROUND(sqd_disc, 2)`), 'discount'],
                [Sequelize.literal(`CAST(SUM((sqd_price * sqd_qty) - (sqd_price * sqd_qty * sqd_disc)) AS INTEGER)`), 'total_price']
            ],
            where: {
                sqd_oid: detailSalesQuotationOid
            },
            group: [
                'detail_sales_quotation_oid',
                'header_sales_quotation_oid',
                'product_id',
                'location_id',
                'inventory_oid',
                'quantity',
                'price',
                'discount'
            ]
        });

        console.info(result);

        return result;
    }

    retrieveStatusSalesQuotationHeader = async ( headerSalesQuotationOid ) => {
        let result = await SqMstr.findOne({
            attributes: ['sq_oid', 'sq_trans_id', 'sq_code', 'sq_booking', 'sq_ptsfr_loc_id', 'sq_en_id', 'sq_ar_ac_id', 'sq_ar_sb_id', 'sq_ar_cc_id', 'sq_trans_id'],
            where: {
                sq_oid: headerSalesQuotationOid
            }
        });

        return result;
    }

    findDataDetailSalesQuotation = async ( headerSalesQuotationOid, productId, locationId ) => {
        let result = await SqdDet.findOne({
            attributes: [
                'sqd_oid',
                'sqd_sq_oid',
                'sqd_qty',
                'sqd_pt_id',
                'sqd_loc_id',
                'sqd_invc_oid',
            ],
            where: {
                sqd_sq_oid: headerSalesQuotationOid,
                sqd_pt_id: productId,
                sqd_loc_id: locationId
            }
        });

        return result;
    }

    findDetailSqByOid = async ( detailSalesQuotationOid ) => {
        let result = await SqdDet.findOne({
            attributes: [
                'sqd_oid',
                'sqd_sq_oid',
                ['sqd_pt_id', 'product_id'],
                ['sqd_loc_id', 'location_id'],
                ['sqd_invc_oid', 'inventory_oid'],
                [Sequelize.literal('CAST(sqd_qty AS INTEGER)'), 'qty'],
                [Sequelize.literal('CAST(sqd_price AS INTEGER)'), 'price'],
                ['sqd_disc', 'discount']
            ],
            where: {
                sqd_oid: detailSalesQuotationOid
            },
        });

        return result;
    }

    updateDataHeaderSq = async ( headerSalesQuotationOid, dataUser, dataUpdate, transaction ) => {
        await SqMstr.update({
            sq_upd_by: dataUser.usernama,
            sq_upd_date: Sequelize.literal(`CURRENT_TIMESTAMP`),
            sq_date: dataUpdate.date || Sequelize.literal('sq_date'),
            sq_sales_person: dataUpdate.sales_person_id || Sequelize.literal(`sq_sales_person`),
            sq_ar_ac_id: dataUpdate.account_id || Sequelize.literal(`sq_ar_ac_id`),
            sq_ar_sb_id: dataUpdate.subaccount_id || Sequelize.literal(`sq_ar_sb_id`),
            sq_ar_cc_id: dataUpdate.cost_center_id || Sequelize.literal(`sq_ar_cc_id`),
            sq_trans_id: dataUpdate.transaction_status || Sequelize.literal(`sq_trans_id`),
            sq_ptsfr_loc_id: dataUpdate.origin_location_id || Sequelize.literal(`sq_ptsfr_loc_id`),
            sq_ptsfr_loc_to_id: dataUpdate.destination_location_id || Sequelize.literal(`sq_ptsfr_loc_to_id`),
            sq_ptsfr_loc_git: dataUpdate.git_location_id || Sequelize.literal(`sq_ptsfr_loc_git`),
            sq_pi_area_id: dataUpdate.pricelist_area_id || Sequelize.literal(`sq_pi_area_id`),
            sq_credit_term: dataUpdate.credit_terms_id || Sequelize.literal(`sq_credit_term`),
            sq_need_date: dataUpdate.need_date || Sequelize.literal(`sq_need_date`),
            sq_due_date: dataUpdate.due_date || Sequelize.literal(`sq_due_date`),
            sq_close_date: dataUpdate.close_date || Sequelize.literal(`sq_close_date`),
            sq_pay_method: dataUpdate.payment_method_id || Sequelize.literal(`sq_pay_method`),
            sq_cons: dataUpdate.is_consigment || Sequelize.literal(`sq_cons`),
            sq_total: dataUpdate.total_price || Sequelize.literal(`sq_total`),
            sq_terbilang: dataUpdate.terbilang_harga || Sequelize.literal(`sq_terbilang`),
            sq_ref_po_code: dataUpdate.po_code || Sequelize.literal(`sq_ref_po_code`),
            sq_ref_po_oid: dataUpdate.po_oid || Sequelize.literal('sq_ref_po_oid'),
            sq_exc_rate: dataUpdate.exchange_rate || Sequelize.literal(`sq_exc_rate`),
            sq_trans_rmks: dataUpdate.remarks || Sequelize.literal(`sq_trans_rmks`)
        }, {
            where: {
                sq_oid: headerSalesQuotationOid
            },
            transaction
        })
    }

    updateDataDetailSq = async ( detailSalesQuotationOid, dataUser, dataUpdate, transaction ) => {
        await SqdDet.update({
            sqd_upd_by: (dataUser) ? dataUser.usernama : Sequelize.literal('sqd_upd_by'),
            sqd_upd_date: (dataUser) ? Sequelize.literal(`CURRENT_TIMESTAMP`) : Sequelize.literal(`sqd_upd_date`),
            sqd_qty: dataUpdate.quantity,
            sqd_qty_real: dataUpdate.quantity,
            sqd_price: dataUpdate.price || Sequelize.literal(`sqd_price`),
            sqd_disc: dataUpdate.discount || Sequelize.literal(`sqd_disc`),
            sqd_ppn_type: dataUpdate.ppn_type || Sequelize.literal(`sqd_ppn_type`),
            sqd_dp: dataUpdate.prepayment || Sequelize.literal(`sqd_dp`),
            sqd_payment: dataUpdate.payment || Sequelize.literal(`sqd_payment`),
            sqd_sales_unit: dataUpdate.sales_unit || Sequelize.literal(`sqd_sales_unit`),
            sqd_qty_shipment: dataUpdate.qty_shipment || Sequelize.literal(`sqd_qty_shipment`)
        }, {
            where: {
                sqd_oid: detailSalesQuotationOid
            },
            transaction
        })
    }

    retrieveTotalPrice = async ( headerSalesQuotationOid ) => {
        let result = await SqdDet.findAll({
            attributes: [
                [Sequelize.literal(`ROUND(SUM((sqd_price * sqd_qty) - (sqd_price * sqd_disc * sqd_qty)), 2)`), 'total_price']
            ],
            where: {
                sqd_sq_oid: headerSalesQuotationOid
            }
        });

        return result;
    }

    deleteDetailSqByOid = async ( detailSalesQuotationOid, transaction ) => {
        console.info(detailSalesQuotationOid);

        await SqdDet.destroy({
            where: {
                sqd_oid: detailSalesQuotationOid
            },
            transaction
        })
    }

    retrieveLastSequence = async ( headerSalesQuotationOid ) => {
        let result = await SqdDet.findOne({
            attributes: [
                [Sequelize.literal(`CAST(sqd_seq AS INTEGER)`), 'last_sequence']
            ],
            where: {
                sqd_sq_oid: headerSalesQuotationOid
            },
            order: [
                ['sqd_add_date', 'DESC']
            ]
        });

        return result;
    }
}

module.exports = new SalesQuotationService();
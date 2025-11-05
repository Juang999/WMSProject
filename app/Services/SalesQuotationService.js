const { required } = require('joi');
const { 
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
}

module.exports = new SalesQuotationService();
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SqMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SqMstr.belongsTo(models.EnMstr, {
        as: 'entity_relation',
        targetKey: 'en_id',
        foreignKey: 'sq_en_id'
      });

      SqMstr.belongsTo(models.SiMstr, {
        as: 'site_relation',
        targetKey: 'si_id',
        foreignKey: 'sq_si_id'
      });

      SqMstr.belongsTo(models.PtnrMstr, {
        as: 'sold_to_relation',
        targetKey: 'ptnr_id',
        foreignKey: 'sq_ptnr_id_sold'
      });

      SqMstr.belongsTo(models.PtnrMstr, {
        as: 'bill_to_relation',
        targetKey: 'ptnr_id',
        foreignKey: 'sq_ptnr_id_bill'
      });

      SqMstr.belongsTo(models.PtnrMstr, {
        as: 'sales_person_relation',
        targetKey: 'ptnr_id',
        foreignKey: 'sq_sales_person'
      });

      SqMstr.belongsTo(models.AreaMstr, {
        as: 'area_pricelist_relation',
        targetKey: 'area_id',
        foreignKey: 'sq_pi_area_id'
      });

      SqMstr.belongsTo(models.PiMstr, {
        as: 'pricelist_relation',
        targetKey: 'pi_id',
        foreignKey: 'sq_pi_id'
      });

      SqMstr.belongsTo(models.CodeMstr, {
        as: 'payment_type_relation',
        targetKey: 'code_id',
        foreignKey: 'sq_pay_type'
      });

      SqMstr.belongsTo(models.CodeMstr, {
        as: 'credit_term_relation',
        targetKey: 'code_id',
        foreignKey: 'sq_credit_term'
      });

      SqMstr.belongsTo(models.CodeMstr, {
        as: 'payment_method_relation',
        targetKey: 'code_id',
        foreignKey: 'sq_pay_method'
      });

      SqMstr.belongsTo(models.PsMstr, {
        as: 'package_relation',
        targetKey: 'ps_id',
        foreignKey: 'sq_ps_id'
      });

      SqMstr.belongsTo(models.DbgGroup, {
        as: 'grouping_relation',
        targetKey: 'dbg_id',
        foreignKey: 'sq_dbg_ptnr_id'
      });

      SqMstr.belongsTo(models.LocMstr, {
        as: 'origin_location',
        targetKey: 'loc_id',
        foreignKey: 'sq_ptsfr_loc_id'
      });

      SqMstr.belongsTo(models.LocMstr, {
        as: 'destination_location',
        targetKey: 'loc_id',
        foreignKey: 'sq_ptsfr_loc_to_id'
      });

      SqMstr.belongsTo(models.LocMstr, {
        as: 'location_git',
        targetKey: 'loc_id',
        foreignKey: 'sq_ptsfr_loc_git'
      });

      SqMstr.belongsTo(models.AcMstr, {
        as: 'account_relation',
        targetKey: 'ac_id',
        foreignKey: 'sq_ar_ac_id'
      });

      SqMstr.belongsTo(models.SbMstr, {
        as: 'subaccount_relation',
        targetKey: 'sb_id',
        foreignKey: 'sq_ar_sb_id'
      });

      SqMstr.belongsTo(models.CcMstr, {
        as: 'cost_center_relation',
        targetKey: 'cc_id',
        foreignKey: 'sq_ar_cc_id'
      });

      SqMstr.belongsTo(models.CuMstr, {
        as: 'currency_relation',
        targetKey: 'cu_id',
        foreignKey: 'sq_cu_id'
      });

      SqMstr.belongsTo(models.PtnrgGrp, {
        as: 'partnergroup_relation',
        targetKey: 'ptnrg_id',
        foreignKey: 'sq_cu_id'
      });

      SqMstr.belongsTo(models.SlsProgram, {
        as: 'sales_program_relation',
        targetKey: 'sls_code',
        foreignKey: 'sq_sales_program'
      });

      SqMstr.hasMany(models.SqdDet, {
        as: 'detail_sales_quotation_relation',
        sourceKey: 'sq_oid',
        foreignKey: 'sqd_sq_oid'
      })
    }
  }
  SqMstr.init({
    sq_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    sq_dom_id: DataTypes.INTEGER,
    sq_en_id: DataTypes.INTEGER,
    sq_add_by: DataTypes.STRING,
    sq_add_date: DataTypes.DATE,
    sq_upd_by: DataTypes.STRING,
    sq_upd_date: DataTypes.DATE,
    sq_code: DataTypes.STRING,
    sq_ptnr_id_sold: DataTypes.INTEGER,
    sq_ptnr_id_bill: DataTypes.INTEGER,
    sq_date: DataTypes.DATEONLY,
    sq_credit_term: DataTypes.INTEGER,
    sq_taxable: DataTypes.STRING,
    sq_tax_class: DataTypes.INTEGER,
    sq_si_id: DataTypes.INTEGER,
    sq_type: DataTypes.STRING,
    sq_sales_person: DataTypes.INTEGER,
    sq_pi_id: DataTypes.INTEGER,
    sq_pay_type: DataTypes.INTEGER,
    sq_pay_method: DataTypes.INTEGER,
    sq_dp: DataTypes.INTEGER,
    sq_disc_header: DataTypes.INTEGER,
    sq_total: DataTypes.INTEGER,
    sq_print_count: DataTypes.INTEGER,
    sq_due_date: DataTypes.DATEONLY,
    sq_close_date: DataTypes.DATEONLY,
    sq_tran_id: DataTypes.STRING,
    sq_trans_id: DataTypes.STRING,
    sq_trans_rmks: DataTypes.STRING,
    sq_current_route: DataTypes.STRING,
    sq_next_route: DataTypes.STRING,
    sq_dt: DataTypes.DATE,
    sq_bk_appr: DataTypes.STRING,
    sq_cu_id: DataTypes.INTEGER,
    sq_total_ppn: DataTypes.INTEGER,
    sq_total_pph: DataTypes.INTEGER,
    sq_payment: DataTypes.INTEGER,
    sq_exc_rate: DataTypes.INTEGER,
    sq_tax_inc: DataTypes.STRING,
    sq_cons: DataTypes.STRING,
    sq_terbilang: DataTypes.STRING,
    sq_bk_id: DataTypes.INTEGER,
    sq_interval: DataTypes.INTEGER,
    sq_ref_po_code: DataTypes.STRING,
    sq_ref_po_oid: DataTypes.UUID,
    sq_ppn_type: DataTypes.STRING,
    sq_ac_prepaid: DataTypes.INTEGER,
    sq_pay_prepaod: DataTypes.INTEGER,
    sq_ar_ac_id: DataTypes.INTEGER,
    sq_ar_sb_id: DataTypes.INTEGER,
    sq_ar_cc_id: DataTypes.INTEGER,
    sq_need_date: DataTypes.DATE,
    sq_payment_date: DataTypes.DATE,
    sq_last_transaction: DataTypes.DATE,
    sq_is_package: DataTypes.STRING,
    sq_pt_id: DataTypes.INTEGER,
    sq_price: DataTypes.INTEGER,
    sq_sales_program: DataTypes.STRING,
    sq_status_produk: DataTypes.STRING,
    sq_diskon_produk: DataTypes.STRING,
    sq_unique_code: DataTypes.STRING,
    sq_dp_unique: DataTypes.STRING,
    sq_payment_unique: DataTypes.STRING,
    so_cons: DataTypes.STRING,
    sq_booking: DataTypes.STRING,
    sq_book_start_date: DataTypes.DATEONLY,
    sq_book_end_date: DataTypes.DATEONLY,
    sq_alocated: DataTypes.STRING,
    sq_book_status: DataTypes.STRING,
    sq_quo_type: DataTypes.INTEGER,
    sq_project: DataTypes.STRING,
    sq_shipping_charges: DataTypes.INTEGER,
    sq_total_final: DataTypes.INTEGER,
    sq_indent: DataTypes.STRING,
    sq_manufacture: DataTypes.STRING,
    sq_ptsfr_loc_id: DataTypes.INTEGER,
    sq_ptsfr_loc_to_id: DataTypes.INTEGER,
    sq_ptsfr_loc_git: DataTypes.INTEGER,
    sq_en_to_id: DataTypes.INTEGER,
    sq_si_to_id: DataTypes.INTEGER,
    sq_rebooking: DataTypes.STRING,
    sq_sq_ref_oid: DataTypes.UUID,
    sq_sq_ref_code: DataTypes.STRING,
    sq_dropshipper: DataTypes.STRING,
    sq_ship_to: DataTypes.STRING,
    sq_pi_area_id: DataTypes.INTEGER,
    sq_ds_ptnr_id: DataTypes.INTEGER,
    sq_dbg_ptnr_id: DataTypes.INTEGER,
    sq_dg_group: DataTypes.STRING,
    sq_ps_id: DataTypes.INTEGER,
    sq_ptnra_id: DataTypes.INTEGER,
    sq_ajb_code: DataTypes.STRING,
    sq_shipping_name: DataTypes.STRING,
    sq_midtrans_inv_number: DataTypes.STRING,
    sq_midtrans_inv_status: DataTypes.STRING,
    sq_shipping_service: DataTypes.STRING,
    sq_sqm_code: DataTypes.STRING,
    sq_partner_reference_id: DataTypes.INTEGER,
    sq_packing_charges: DataTypes.INTEGER,
    sq_first_name: DataTypes.STRING,
    sq_last_name: DataTypes.STRING,
    sq_full_address: DataTypes.STRING,
    sq_city: DataTypes.STRING,
    sq_email: DataTypes.STRING,
    sq_phone_number: DataTypes.STRING,
    sq_link_resi: DataTypes.STRING,
    sq_dropship_address: DataTypes.STRING,
    sq_paid_off_status: DataTypes.STRING,
    sq_pay_amount: DataTypes.INTEGER,
    sq_approval_status: DataTypes.STRING,
    sq_approval: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'sq_mstr',
    timestamps: false,
    modelName: 'SqMstr',
  });
  return SqMstr;
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SqMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sq_oid: {
        type: Sequelize.UUID
      },
      sq_dom_id: {
        type: Sequelize.INTEGER
      },
      sq_en_id: {
        type: Sequelize.INTEGER
      },
      sq_add_by: {
        type: Sequelize.STRING
      },
      sq_add_date: {
        type: Sequelize.DATE
      },
      sq_upd_by: {
        type: Sequelize.STRING
      },
      sq_upd_date: {
        type: Sequelize.DATE
      },
      sq_code: {
        type: Sequelize.STRING
      },
      sq_ptnr_id_sold: {
        type: Sequelize.INTEGER
      },
      sq_ptnr_id_bill: {
        type: Sequelize.INTEGER
      },
      sq_date: {
        type: Sequelize.DATEONLY
      },
      sq_credit_term: {
        type: Sequelize.INTEGER
      },
      sq_taxable: {
        type: Sequelize.STRING
      },
      sq_tax_class: {
        type: Sequelize.INTEGER
      },
      sq_si_id: {
        type: Sequelize.INTEGER
      },
      sq_type: {
        type: Sequelize.STRING
      },
      sq_sales_person: {
        type: Sequelize.INTEGER
      },
      sq_pi_id: {
        type: Sequelize.INTEGER
      },
      sq_pay_type: {
        type: Sequelize.INTEGER
      },
      sq_pay_method: {
        type: Sequelize.INTEGER
      },
      sq_dp: {
        type: Sequelize.INTEGER
      },
      sq_disc_header: {
        type: Sequelize.INTEGER
      },
      sq_total: {
        type: Sequelize.INTEGER
      },
      sq_print_count: {
        type: Sequelize.INTEGER
      },
      sq_due_date: {
        type: Sequelize.DATEONLY
      },
      sq_close_date: {
        type: Sequelize.DATEONLY
      },
      sq_tran_id: {
        type: Sequelize.STRING
      },
      sq_trans_id: {
        type: Sequelize.STRING
      },
      sq_trans_rmks: {
        type: Sequelize.STRING
      },
      sq_current_route: {
        type: Sequelize.STRING
      },
      sq_next_route: {
        type: Sequelize.STRING
      },
      sq_dt: {
        type: Sequelize.DATE
      },
      sq_bk_appr: {
        type: Sequelize.STRING
      },
      sq_cu_id: {
        type: Sequelize.INTEGER
      },
      sq_total_ppn: {
        type: Sequelize.INTEGER
      },
      sq_total_pph: {
        type: Sequelize.INTEGER
      },
      sq_payment: {
        type: Sequelize.INTEGER
      },
      sq_exc_rate: {
        type: Sequelize.INTEGER
      },
      sq_tax_inc: {
        type: Sequelize.STRING
      },
      sq_cons: {
        type: Sequelize.STRING
      },
      sq_terbilang: {
        type: Sequelize.STRING
      },
      sq_bk_id: {
        type: Sequelize.INTEGER
      },
      sq_interval: {
        type: Sequelize.INTEGER
      },
      sq_ref_po_code: {
        type: Sequelize.STRING
      },
      sq_ref_po_oid: {
        type: Sequelize.UUID
      },
      sq_ppn_type: {
        type: Sequelize.STRING
      },
      sq_ac_prepaid: {
        type: Sequelize.INTEGER
      },
      sq_pay_prepaod: {
        type: Sequelize.INTEGER
      },
      sq_ar_ac_id: {
        type: Sequelize.INTEGER
      },
      sq_ar_sb_id: {
        type: Sequelize.INTEGER
      },
      sq_ar_cc_id: {
        type: Sequelize.INTEGER
      },
      sq_need_date: {
        type: Sequelize.DATE
      },
      sq_payment_date: {
        type: Sequelize.DATE
      },
      sq_last_transaction: {
        type: Sequelize.DATE
      },
      sq_is_package: {
        type: Sequelize.STRING
      },
      sq_pt_id: {
        type: Sequelize.INTEGER
      },
      sq_price: {
        type: Sequelize.INTEGER
      },
      sq_sales_program: {
        type: Sequelize.STRING
      },
      sq_status_produk: {
        type: Sequelize.STRING
      },
      sq_diskon_produk: {
        type: Sequelize.STRING
      },
      sq_unique_code: {
        type: Sequelize.STRING
      },
      sq_dp_unique: {
        type: Sequelize.STRING
      },
      sq_payment_unique: {
        type: Sequelize.STRING
      },
      so_cons: {
        type: Sequelize.STRING
      },
      sq_booking: {
        type: Sequelize.STRING
      },
      sq_book_start_date: {
        type: Sequelize.DATEONLY
      },
      sq_book_end_date: {
        type: Sequelize.DATEONLY
      },
      sq_alocated: {
        type: Sequelize.STRING
      },
      sq_book_status: {
        type: Sequelize.STRING
      },
      sq_quo_type: {
        type: Sequelize.INTEGER
      },
      sq_project: {
        type: Sequelize.STRING
      },
      sq_shipping_charges: {
        type: Sequelize.INTEGER
      },
      sq_total_final: {
        type: Sequelize.INTEGER
      },
      sq_indent: {
        type: Sequelize.STRING
      },
      sq_manufacture: {
        type: Sequelize.STRING
      },
      sq_ptsfr_loc_id: {
        type: Sequelize.INTEGER
      },
      sq_ptsfr_loc_to_id: {
        type: Sequelize.INTEGER
      },
      sq_ptsfr_loc_git: {
        type: Sequelize.INTEGER
      },
      sq_en_to_id: {
        type: Sequelize.INTEGER
      },
      sq_si_to_id: {
        type: Sequelize.INTEGER
      },
      sq_rebooking: {
        type: Sequelize.STRING
      },
      sq_sq_ref_oid: {
        type: Sequelize.UUID
      },
      sq_sq_ref_code: {
        type: Sequelize.STRING
      },
      sq_dropshipper: {
        type: Sequelize.STRING
      },
      sq_ship_to: {
        type: Sequelize.STRING
      },
      sq_pi_area_id: {
        type: Sequelize.INTEGER
      },
      sq_ds_ptnr_id: {
        type: Sequelize.INTEGER
      },
      sq_dbg_ptnr_id: {
        type: Sequelize.INTEGER
      },
      sq_dg_group: {
        type: Sequelize.STRING
      },
      sq_ps_id: {
        type: Sequelize.INTEGER
      },
      sq_ptnra_id: {
        type: Sequelize.INTEGER
      },
      sq_ajb_code: {
        type: Sequelize.STRING
      },
      sq_shipping_name: {
        type: Sequelize.STRING
      },
      sq_midtrans_inv_number: {
        type: Sequelize.STRING
      },
      sq_midtrans_inv_status: {
        type: Sequelize.STRING
      },
      sq_shipping_service: {
        type: Sequelize.STRING
      },
      sq_sqm_code: {
        type: Sequelize.STRING
      },
      sq_partner_reference_id: {
        type: Sequelize.INTEGER
      },
      sq_packing_charges: {
        type: Sequelize.INTEGER
      },
      sq_first_name: {
        type: Sequelize.STRING
      },
      sq_last_name: {
        type: Sequelize.STRING
      },
      sq_full_address: {
        type: Sequelize.STRING
      },
      sq_city: {
        type: Sequelize.STRING
      },
      sq_email: {
        type: Sequelize.STRING
      },
      sq_phone_number: {
        type: Sequelize.STRING
      },
      sq_link_resi: {
        type: Sequelize.STRING
      },
      sq_dropship_address: {
        type: Sequelize.STRING
      },
      sq_paid_off_status: {
        type: Sequelize.STRING
      },
      sq_pay_amount: {
        type: Sequelize.INTEGER
      },
      sq_approval_status: {
        type: Sequelize.STRING
      },
      sq_approval: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SqMstrs');
  }
};
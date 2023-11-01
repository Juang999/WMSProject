'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PoMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      po_oid: {
        type: Sequelize.UUID
      },
      po_dom_id: {
        type: Sequelize.INTEGER
      },
      po_en_id: {
        type: Sequelize.INTEGER
      },
      po_upd_date: {
        type: Sequelize.DATE
      },
      po_upd_by: {
        type: Sequelize.STRING
      },
      po_add_date: {
        type: Sequelize.DATE
      },
      po_add_by: {
        type: Sequelize.STRING
      },
      po_code: {
        type: Sequelize.STRING
      },
      po_ptnr_id: {
        type: Sequelize.INTEGER
      },
      po_cmaddr_id: {
        type: Sequelize.INTEGER
      },
      po_date: {
        type: Sequelize.DATE
      },
      po_need_date: {
        type: Sequelize.DATE
      },
      po_due_date: {
        type: Sequelize.DATE
      },
      po_rmks: {
        type: Sequelize.STRING
      },
      po_sb_id: {
        type: Sequelize.INTEGER
      },
      po_cc_id: {
        type: Sequelize.INTEGER
      },
      po_si_id: {
        type: Sequelize.INTEGER
      },
      po_pjc_id: {
        type: Sequelize.INTEGER
      },
      po_close_date: {
        type: Sequelize.DATE
      },
      po_total: {
        type: Sequelize.INTEGER
      },
      po_tran_id: {
        type: Sequelize.INTEGER
      },
      po_trans_id: {
        type: Sequelize.STRING
      },
      po_credit_term: {
        type: Sequelize.INTEGER
      },
      po_taxable: {
        type: Sequelize.STRING
      },
      po_tax_inc: {
        type: Sequelize.STRING
      },
      po_tax_class: {
        type: Sequelize.INTEGER
      },
      po_cu_id: {
        type: Sequelize.INTEGER
      },
      po_exc_rate: {
        type: Sequelize.INTEGER
      },
      po_trans_rmks: {
        type: Sequelize.STRING
      },
      po_current_route: {
        type: Sequelize.STRING
      },
      po_next_route: {
        type: Sequelize.STRING
      },
      po_dt: {
        type: Sequelize.DATE
      },
      po_total_ppn: {
        type: Sequelize.INTEGER
      },
      po_freight: {
        type: Sequelize.INTEGER
      },
      po_total_pph: {
        type: Sequelize.INTEGER
      },
      po_status_cash: {
        type: Sequelize.STRING
      },
      po_bk_id: {
        type: Sequelize.INTEGER
      },
      po_film: {
        type: Sequelize.STRING
      },
      po_auto_receipt: {
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
    await queryInterface.dropTable('PoMstrs');
  }
};
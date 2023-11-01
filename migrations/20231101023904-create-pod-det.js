'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PodDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pod_oid: {
        type: Sequelize.UUID
      },
      pod_dom_id: {
        type: Sequelize.INTEGER
      },
      pod_en_id: {
        type: Sequelize.INTEGER
      },
      pod_add_by: {
        type: Sequelize.STRING
      },
      pod_add_date: {
        type: Sequelize.DATE
      },
      pod_upd_by: {
        type: Sequelize.STRING
      },
      pod_upd_date: {
        type: Sequelize.DATE
      },
      pod_po_oid: {
        type: Sequelize.UUID
      },
      pod_seq: {
        type: Sequelize.INTEGER
      },
      pod_reqd_oid: {
        type: Sequelize.UUID
      },
      pod_si_id: {
        type: Sequelize.INTEGER
      },
      pod_pt_id: {
        type: Sequelize.INTEGER
      },
      pod_rmks: {
        type: Sequelize.STRING
      },
      pod_end_user: {
        type: Sequelize.STRING
      },
      pod_qty: {
        type: Sequelize.INTEGER
      },
      pod_qty_receive: {
        type: Sequelize.INTEGER
      },
      pod_qty_invoice: {
        type: Sequelize.INTEGER
      },
      pod_um: {
        type: Sequelize.INTEGER
      },
      pod_cost: {
        type: Sequelize.INTEGER
      },
      pod_disc: {
        type: Sequelize.INTEGER
      },
      pod_sb_id: {
        type: Sequelize.INTEGER
      },
      pod_cc_id: {
        type: Sequelize.INTEGER
      },
      pod_pjc_id: {
        type: Sequelize.INTEGER
      },
      pod_need_date: {
        type: Sequelize.DATE
      },
      pod_due_date: {
        type: Sequelize.DATE
      },
      pod_um_conv: {
        type: Sequelize.INTEGER
      },
      pod_qty_real: {
        type: Sequelize.INTEGER
      },
      pod_pt_class: {
        type: Sequelize.STRING
      },
      pod_taxable: {
        type: Sequelize.STRING
      },
      pod_tax_inc: {
        type: Sequelize.STRING
      },
      pod_tax_class: {
        type: Sequelize.INTEGER
      },
      pod_status: {
        type: Sequelize.STRING
      },
      pod_dt: {
        type: Sequelize.DATE
      },
      pod_qty_return: {
        type: Sequelize.INTEGER
      },
      pod_memo: {
        type: Sequelize.STRING
      },
      pod_pt_desc1: {
        type: Sequelize.STRING
      },
      pod_pt_desc2: {
        type: Sequelize.STRING
      },
      pod_qty_so: {
        type: Sequelize.INTEGER
      },
      pod_loc_id: {
        type: Sequelize.INTEGER
      },
      pod_height: {
        type: Sequelize.INTEGER
      },
      pod_width: {
        type: Sequelize.INTEGER
      },
      pod_cost_film: {
        type: Sequelize.INTEGER
      },
      pod_ppn: {
        type: Sequelize.INTEGER
      },
      pod_pph: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('PodDets');
  }
};
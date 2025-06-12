'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PbMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pb_oid: {
        type: Sequelize.UUID
      },
      pb_dom_id: {
        type: Sequelize.INTEGER
      },
      pb_en_id: {
        type: Sequelize.INTEGER
      },
      pb_add_by: {
        type: Sequelize.STRING
      },
      pb_add_date: {
        type: Sequelize.DATE
      },
      pb_upd_by: {
        type: Sequelize.STRING
      },
      pb_upd_date: {
        type: Sequelize.DATE
      },
      pb_date: {
        type: Sequelize.DATE
      },
      pb_due_date: {
        type: Sequelize.DATE
      },
      pb_requested: {
        type: Sequelize.STRING
      },
      pb_end_user: {
        type: Sequelize.STRING
      },
      pb_rmks: {
        type: Sequelize.STRING
      },
      pb_status: {
        type: Sequelize.STRING
      },
      pb_close_date: {
        type: Sequelize.DATE
      },
      pb_dt: {
        type: Sequelize.DATE
      },
      pb_code: {
        type: Sequelize.STRING
      },
      pb_trans_id: {
        type: Sequelize.STRING
      },
      pb_tran_id: {
        type: Sequelize.INTEGER
      },
      pb_pbt_code: {
        type: Sequelize.STRING
      },
      pb_wo_oid: {
        type: Sequelize.UUID
      },
      pb_is_unplan: {
        type: Sequelize.STRING
      },
      pb_en_id_shipment: {
        type: Sequelize.INTEGER
      },
      pb_reff_code: {
        type: Sequelize.STRING
      },
      pb_status_inv_issue: {
        type: Sequelize.STRING
      },
      pb_status_inv_receipt: {
        type: Sequelize.STRING
      },
      pb_inv_issue_code: {
        type: Sequelize.STRING
      },
      pb_status_reject_web: {
        type: Sequelize.STRING
      },
      pb_inv_receipt_code: {
        type: Sequelize.STRING
      },
      pb_status_packing: {
        type: Sequelize.STRING
      },
      pb_packing_by: {
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
    await queryInterface.dropTable('PbMstrs');
  }
};
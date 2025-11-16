'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RcvMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rcv_oid: {
        type: Sequelize.UUID
      },
      rcv_dom_id: {
        type: Sequelize.INTEGER
      },
      rcv_en_id: {
        type: Sequelize.INTEGER
      },
      rcv_add_by: {
        type: Sequelize.STRING
      },
      rcv_add_date: {
        type: Sequelize.DATE
      },
      rcv_upd_by: {
        type: Sequelize.STRING
      },
      rcv_upd_date: {
        type: Sequelize.DATE
      },
      rcv_code: {
        type: Sequelize.STRING
      },
      rcv_date: {
        type: Sequelize.DATE
      },
      rcv_eff_date: {
        type: Sequelize.DATE
      },
      rcv_po_oid: {
        type: Sequelize.UUID
      },
      rcv_packing_slip: {
        type: Sequelize.STRING
      },
      rcv_dt: {
        type: Sequelize.DATE
      },
      rcv_is_receive: {
        type: Sequelize.STRING
      },
      rcv_ret_replace: {
        type: Sequelize.STRING
      },
      rcv_cu_id: {
        type: Sequelize.INTEGER
      },
      rcv_exc_rate: {
        type: Sequelize.INTEGER
      },
      rcv_remarks: {
        type: Sequelize.STRING
      },
      rcv_cly_end: {
        type: Sequelize.INTEGER
      },
      rcv_freff_oid: {
        type: Sequelize.UUID
      },
      rcv_treff_oid: {
        type: Sequelize.UUID
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
    await queryInterface.dropTable('RcvMstrs');
  }
};
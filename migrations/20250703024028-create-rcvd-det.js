'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RcvdDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rcvd_oid: {
        type: Sequelize.UUID
      },
      rcvd_rcv_oid: {
        type: Sequelize.UUID
      },
      rcvd_pod_oid: {
        type: Sequelize.UUID
      },
      rcvd_qty: {
        type: Sequelize.INTEGER
      },
      rcvd_um: {
        type: Sequelize.INTEGER
      },
      rcvd_packing_qty: {
        type: Sequelize.INTEGER
      },
      rcvd_um_conv: {
        type: Sequelize.INTEGER
      },
      rcvd_qty_real: {
        type: Sequelize.INTEGER
      },
      rcvd_si_id: {
        type: Sequelize.INTEGER
      },
      rcvd_loc_id: {
        type: Sequelize.INTEGER
      },
      rcvd_lot_serial: {
        type: Sequelize.STRING
      },
      rcvd_supp_lot: {
        type: Sequelize.STRING
      },
      rcvd_dt: {
        type: Sequelize.DATE
      },
      rcvd_rea_code_id: {
        type: Sequelize.INTEGER
      },
      rcvd_qty_inv: {
        type: Sequelize.INTEGER
      },
      rcvd_close_line: {
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
    await queryInterface.dropTable('RcvdDets');
  }
};
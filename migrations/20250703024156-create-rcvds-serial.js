'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RcvdsSerials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rcvds_oid: {
        type: Sequelize.UUID
      },
      rcvds_rcvd_oid: {
        type: Sequelize.UUID
      },
      rcvds_qty: {
        type: Sequelize.INTEGER
      },
      rcvds_um: {
        type: Sequelize.INTEGER
      },
      rcvds_si_id: {
        type: Sequelize.INTEGER
      },
      rcvds_loc_id: {
        type: Sequelize.INTEGER
      },
      rcvds_lot_serial: {
        type: Sequelize.STRING
      },
      rcvds_dt: {
        type: Sequelize.DATE
      },
      rcvds_qrbarcode: {
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
    await queryInterface.dropTable('RcvdsSerials');
  }
};
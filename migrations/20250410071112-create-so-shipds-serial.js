'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SoShipdsSerials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      soshipds_oid: {
        type: Sequelize.UUID
      },
      soshipds_soshipd_oid: {
        type: Sequelize.UUID
      },
      soshipds_seq: {
        type: Sequelize.INTEGER
      },
      soshipds_qty: {
        type: Sequelize.INTEGER
      },
      soshipds_qty_real: {
        type: Sequelize.INTEGER
      },
      soshipds_si_id: {
        type: Sequelize.INTEGER
      },
      soshipds_loc_id: {
        type: Sequelize.INTEGER
      },
      soshipds_lot_serial: {
        type: Sequelize.STRING
      },
      soshipds_dt: {
        type: Sequelize.DATE
      },
      soshipds_qrbarcode: {
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
    await queryInterface.dropTable('SoShipdsSerials');
  }
};
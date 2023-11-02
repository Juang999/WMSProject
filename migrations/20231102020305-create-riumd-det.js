'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RiumdDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      riumd_oid: {
        type: Sequelize.UUID
      },
      riumd_rium_oid: {
        type: Sequelize.UUID
      },
      riumd_pt_id: {
        type: Sequelize.INTEGER
      },
      riumd_qty: {
        type: Sequelize.INTEGER
      },
      riumd_um: {
        type: Sequelize.INTEGER
      },
      riumd_um_conv: {
        type: Sequelize.INTEGER
      },
      riumd_qty_real: {
        type: Sequelize.INTEGER
      },
      riumd_si_id: {
        type: Sequelize.INTEGER
      },
      riumd_loc_id: {
        type: Sequelize.INTEGER
      },
      riumd_lot_serial: {
        type: Sequelize.STRING
      },
      riumd_cost: {
        type: Sequelize.INTEGER
      },
      riumd_ac_id: {
        type: Sequelize.INTEGER
      },
      riumd_sb_id: {
        type: Sequelize.INTEGER
      },
      riumd_cc_id: {
        type: Sequelize.INTEGER
      },
      riumd_dt: {
        type: Sequelize.DATE
      },
      riumd_sod_oid: {
        type: Sequelize.UUID
      },
      riumd_pbd_oid: {
        type: Sequelize.UUID
      },
      riumd_cost_total: {
        type: Sequelize.INTEGER
      },
      riumd_qty_shipment: {
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
    await queryInterface.dropTable('RiumdDets');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RiudDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      riud_oid: {
        type: Sequelize.UUID
      },
      riud_riu_oid: {
        type: Sequelize.UUID
      },
      riud_pt_id: {
        type: Sequelize.INTEGER
      },
      riud_qty: {
        type: Sequelize.INTEGER
      },
      riud_um: {
        type: Sequelize.INTEGER
      },
      riud_um_conv: {
        type: Sequelize.INTEGER
      },
      riud_qty_real: {
        type: Sequelize.INTEGER
      },
      riud_si_id: {
        type: Sequelize.INTEGER
      },
      riud_loc_id: {
        type: Sequelize.INTEGER
      },
      riud_lot_serial: {
        type: Sequelize.STRING
      },
      riud_cost: {
        type: Sequelize.INTEGER
      },
      riud_ac_id: {
        type: Sequelize.INTEGER
      },
      riud_sb_id: {
        type: Sequelize.INTEGER
      },
      riud_cc_id: {
        type: Sequelize.INTEGER
      },
      riud_dt: {
        type: Sequelize.DATE
      },
      riud_sod_oid: {
        type: Sequelize.UUID
      },
      riud_pbd_oid: {
        type: Sequelize.UUID
      },
      riud_cost_total: {
        type: Sequelize.INTEGER
      },
      riud_qty_shipment: {
        type: Sequelize.INTEGER
      },
      riud_locs_id: {
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
    await queryInterface.dropTable('RiudDets');
  }
};
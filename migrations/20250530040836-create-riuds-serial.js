'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RiudsSerials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      riuds_oid: {
        type: Sequelize.UUID
      },
      riuds_riud_oid: {
        type: Sequelize.UUID
      },
      riuds_invcd_oid: {
        type: Sequelize.UUID
      },
      riuds_qty: {
        type: Sequelize.INTEGER
      },
      riuds_si_id: {
        type: Sequelize.INTEGER
      },
      riuds_loc_id: {
        type: Sequelize.INTEGER
      },
      riuds_lot_serial: {
        type: Sequelize.STRING
      },
      riuds_dt: {
        type: Sequelize.DATE
      },
      riuds_um: {
        type: Sequelize.INTEGER
      },
      riuds_qrbarcode: {
        type: Sequelize.STRING
      },
      riuds_serial: {
        type: Sequelize.INTEGER
      },
      riuds_pt_id: {
        type: Sequelize.INTEGER
      },
      riuds_locs_id: {
        type: Sequelize.INTEGER
      },
      riuds_invc_oid: {
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
    await queryInterface.dropTable('RiudsSerials');
  }
};
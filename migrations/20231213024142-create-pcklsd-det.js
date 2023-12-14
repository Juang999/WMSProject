'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PcklsdDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pcklsd_oid: {
        type: Sequelize.UUID
      },
      pcklsd_pckls_oid: {
        type: Sequelize.UUID
      },
      pcklsd_sod_oid: {
        type: Sequelize.UUID
      },
      pcklsd_dt: {
        type: Sequelize.DATE
      },
      pcklsd_seq: {
        type: Sequelize.INTEGER
      },
      pcklsd_sod_qty: {
        type: Sequelize.INTEGER
      },
      pcklsd_packing: {
        type: Sequelize.INTEGER
      },
      pcklsd_collie_number: {
        type: Sequelize.INTEGER
      },
      pcklsd_so_code: {
        type: Sequelize.STRING
      },
      pcklsd_pt_id: {
        type: Sequelize.INTEGER
      },
      pcklsd_open: {
        type: Sequelize.INTEGER
      },
      pcklsd_close_line: {
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
    await queryInterface.dropTable('PcklsdDets');
  }
};
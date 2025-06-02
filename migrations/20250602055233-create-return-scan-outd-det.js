'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReturnScanOutdDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rscd_oid: {
        type: Sequelize.UUID
      },
      rscd_rsc_oid: {
        type: Sequelize.UUID
      },
      rscd_pt_id: {
        type: Sequelize.INTEGER
      },
      rscd_qrbarcode: {
        type: Sequelize.STRING
      },
      rscd_created_by: {
        type: Sequelize.STRING
      },
      rscd_created_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('ReturnScanOutdDets');
  }
};
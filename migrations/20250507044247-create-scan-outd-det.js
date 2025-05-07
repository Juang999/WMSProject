'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ScanOutdDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      scd_oid: {
        type: Sequelize.UUID
      },
      scd_en_id: {
        type: Sequelize.INTEGER
      },
      scd_sc_oid: {
        type: Sequelize.UUID
      },
      scd_pt_id: {
        type: Sequelize.INTEGER
      },
      scd_qty: {
        type: Sequelize.INTEGER
      },
      scd_created_by: {
        type: Sequelize.STRING
      },
      scd_created_at: {
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
    await queryInterface.dropTable('ScanOutdDets');
  }
};
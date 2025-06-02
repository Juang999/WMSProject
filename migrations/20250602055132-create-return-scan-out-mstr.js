'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReturnScanOutMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rsc_oid: {
        type: Sequelize.UUID
      },
      rsc_created_by: {
        type: Sequelize.STRING
      },
      rsc_created_at: {
        type: Sequelize.DATE
      },
      rsc_sc_oid: {
        type: Sequelize.UUID
      },
      rsc_sc_code: {
        type: Sequelize.STRING
      },
      rsc_status_id: {
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
    await queryInterface.dropTable('ReturnScanOutMstrs');
  }
};
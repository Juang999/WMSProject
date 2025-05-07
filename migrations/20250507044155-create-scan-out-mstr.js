'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ScanOutMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sc_oid: {
        type: Sequelize.UUID
      },
      sc_en_id: {
        type: Sequelize.INTEGER
      },
      sc_code: {
        type: Sequelize.STRING
      },
      sc_created_by: {
        type: Sequelize.STRING
      },
      sc_created_at: {
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
    await queryInterface.dropTable('ScanOutMstrs');
  }
};
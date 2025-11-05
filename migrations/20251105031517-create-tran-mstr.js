'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TranMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tran_oid: {
        type: Sequelize.UUID
      },
      tran_id: {
        type: Sequelize.INTEGER
      },
      tran_table: {
        type: Sequelize.STRING
      },
      tran_name: {
        type: Sequelize.STRING
      },
      tran_desc: {
        type: Sequelize.STRING
      },
      tran_review_amount: {
        type: Sequelize.STRING
      },
      tran_dt: {
        type: Sequelize.DATE
      },
      tran_active: {
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
    await queryInterface.dropTable('TranMstrs');
  }
};
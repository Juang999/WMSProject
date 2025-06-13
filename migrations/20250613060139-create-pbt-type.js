'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PbtTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pbt_code: {
        type: Sequelize.STRING
      },
      pbt_desc: {
        type: Sequelize.STRING
      },
      pbt_active: {
        type: Sequelize.STRING
      },
      pbt_add_by: {
        type: Sequelize.STRING
      },
      pbt_add_date: {
        type: Sequelize.DATE
      },
      pbt_upd_by: {
        type: Sequelize.STRING
      },
      pbt_upd_date: {
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
    await queryInterface.dropTable('PbtTypes');
  }
};
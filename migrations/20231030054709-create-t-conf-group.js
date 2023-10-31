'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TConfGroups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupid: {
        type: Sequelize.INTEGER
      },
      groupkode: {
        type: Sequelize.STRING
      },
      groupnama: {
        type: Sequelize.STRING
      },
      groupdefault: {
        type: Sequelize.BOOLEAN
      },
      groupactive: {
        type: Sequelize.STRING
      },
      grouphris: {
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
    await queryInterface.dropTable('TConfGroups');
  }
};
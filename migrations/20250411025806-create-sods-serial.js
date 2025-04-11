'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SodsSerials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sods_oid: {
        type: Sequelize.UUID
      },
      sods_sod_oid: {
        type: Sequelize.UUID
      },
      sods_qty: {
        type: Sequelize.INTEGER
      },
      sods_loc_id: {
        type: Sequelize.INTEGER
      },
      sods_dt: {
        type: Sequelize.DATE
      },
      sods_serial: {
        type: Sequelize.STRING
      },
      sods_seq: {
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
    await queryInterface.dropTable('SodsSerials');
  }
};
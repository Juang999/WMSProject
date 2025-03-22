'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SomddDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      somdd_oid: {
        type: Sequelize.UUID
      },
      somdd_somd_oid: {
        type: Sequelize.UUID
      },
      somdd_seq: {
        type: Sequelize.INTEGER
      },
      somdd_pt_id: {
        type: Sequelize.INTEGER
      },
      somdd_loc_id: {
        type: Sequelize.INTEGER
      },
      somdd_serial: {
        type: Sequelize.INTEGER
      },
      somdd_qty_sys: {
        type: Sequelize.INTEGER
      },
      somdd_qty_real: {
        type: Sequelize.INTEGER
      },
      somdd_created_by: {
        type: Sequelize.STRING
      },
      somdd_created_date: {
        type: Sequelize.DATE
      },
      somdd_updated_by: {
        type: Sequelize.STRING
      },
      somdd_updated_date: {
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
    await queryInterface.dropTable('SomddDets');
  }
};
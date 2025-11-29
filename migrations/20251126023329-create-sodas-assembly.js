'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SodasAssemblies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sodas_oid: {
        type: Sequelize.UUID
      },
      sodas_so_oid: {
        type: Sequelize.UUID
      },
      sodas_pt_id_sod: {
        type: Sequelize.INTEGER
      },
      sodas_pt_id: {
        type: Sequelize.INTEGER
      },
      sodas_qty: {
        type: Sequelize.DECIMAL
      },
      sodas_sod_oid: {
        type: Sequelize.UUID
      },
      sodas_qty_sold: {
        type: Sequelize.UUID
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
    await queryInterface.dropTable('SodasAssemblies');
  }
};
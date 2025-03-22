'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SomdDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      somd_oid: {
        type: Sequelize.UUID
      },
      somd_id: {
        type: Sequelize.INTEGER
      },
      somd_som_oid: {
        type: Sequelize.UUID
      },
      somd_seq: {
        type: Sequelize.INTEGER
      },
      somd_invc_oid: {
        type: Sequelize.UUID
      },
      somd_pt_id: {
        type: Sequelize.INTEGER
      },
      somd_loc_id: {
        type: Sequelize.INTEGER
      },
      somd_serial_lot: {
        type: Sequelize.STRING
      },
      somd_qty_sys: {
        type: Sequelize.INTEGER
      },
      somd_qty_real: {
        type: Sequelize.INTEGER
      },
      somd_created_by: {
        type: Sequelize.STRING
      },
      somd_created_date: {
        type: Sequelize.DATE
      },
      somd_updated_by: {
        type: Sequelize.STRING
      },
      somd_updated_date: {
        type: Sequelize.DATE
      },
      somd_variance: {
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
    await queryInterface.dropTable('SomdDets');
  }
};
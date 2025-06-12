'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PbdsSerials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pbds_oid: {
        type: Sequelize.UUID
      },
      pbds_pbd_oid: {
        type: Sequelize.UUID
      },
      pbds_pt_id: {
        type: Sequelize.INTEGER
      },
      pbds_qrbarcode: {
        type: Sequelize.STRING
      },
      pbds_created_by: {
        type: Sequelize.STRING
      },
      pbds_created_at: {
        type: Sequelize.DATE
      },
      pbds_loc_id: {
        type: Sequelize.INTEGER
      },
      pbds_locs_id: {
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
    await queryInterface.dropTable('PbdsSerials');
  }
};
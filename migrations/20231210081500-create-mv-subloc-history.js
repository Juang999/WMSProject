'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MvSublocHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mvsubloc_oid: {
        type: Sequelize.UUID
      },
      mvsubloc_add_by: {
        type: Sequelize.STRING
      },
      mvsubloc_add_date: {
        type: Sequelize.DATE
      },
      mvsubloc_upd_by: {
        type: Sequelize.STRING
      },
      mvsubloc_upd_date: {
        type: Sequelize.DATE
      },
      mvsubloc_summary: {
        type: Sequelize.STRING
      },
      mvsubloc_desc: {
        type: Sequelize.STRING
      },
      mvsubloc_use_git: {
        type: Sequelize.STRING
      },
      mvsubloc_pt_id: {
        type: Sequelize.INTEGER
      },
      mvsubloc_qty: {
        type: Sequelize.INTEGER
      },
      mvsubloc_locs_from: {
        type: Sequelize.INTEGER
      },
      mvsubloc_locs_git: {
        type: Sequelize.INTEGER
      },
      mvsubloc_locs_to: {
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
    await queryInterface.dropTable('MvSublocHistories');
  }
};
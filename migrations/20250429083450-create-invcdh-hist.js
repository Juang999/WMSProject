'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InvcdhHists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invcdh_oid: {
        type: Sequelize.UUID
      },
      invcdh_dom_id: {
        type: Sequelize.INTEGER
      },
      invcdh_en_id: {
        type: Sequelize.INTEGER
      },
      invcdh_pt_id: {
        type: Sequelize.INTEGER
      },
      invcdh_loc_from_id: {
        type: Sequelize.INTEGER
      },
      invcdh_loc_to_id: {
        type: Sequelize.INTEGER
      },
      invcdh_locs_from_id: {
        type: Sequelize.INTEGER
      },
      invcdh_locs_to_id: {
        type: Sequelize.INTEGER
      },
      invcdh_qrbarcode: {
        type: Sequelize.STRING
      },
      invcdh_status: {
        type: Sequelize.STRING
      },
      invcdh_remarks: {
        type: Sequelize.STRING
      },
      invcdh_created_by: {
        type: Sequelize.STRING
      },
      invcdh_created_date: {
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
    await queryInterface.dropTable('InvcdhHists');
  }
};
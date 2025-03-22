'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SomMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      som_oid: {
        type: Sequelize.UUID
      },
      som_id: {
        type: Sequelize.INTEGER
      },
      som_en_id: {
        type: Sequelize.INTEGER
      },
      som_date: {
        type: Sequelize.DATE
      },
      som_code: {
        type: Sequelize.STRING
      },
      som_loc_id: {
        type: Sequelize.INTEGER
      },
      som_group_code: {
        type: Sequelize.INTEGER
      },
      som_pt_type_id: {
        type: Sequelize.INTEGER
      },
      som_pt_id: {
        type: Sequelize.INTEGER
      },
      som_user_id: {
        type: Sequelize.INTEGER
      },
      som_remarks: {
        type: Sequelize.STRING
      },
      som_status: {
        type: Sequelize.STRING
      },
      som_locked: {
        type: Sequelize.BOOLEAN
      },
      som_qty_ttl: {
        type: Sequelize.INTEGER
      },
      som_created_by: {
        type: Sequelize.STRING
      },
      som_created_date: {
        type: Sequelize.DATE
      },
      som_released_by: {
        type: Sequelize.STRING
      },
      som_released_date: {
        type: Sequelize.DATE
      },
      som_closed_by: {
        type: Sequelize.STRING
      },
      som_closed_date: {
        type: Sequelize.DATE
      },
      som_year: {
        type: Sequelize.INTEGER
      },
      som_start_date: {
        type: Sequelize.DATE
      },
      som_end_date: {
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
    await queryInterface.dropTable('SomMstrs');
  }
};
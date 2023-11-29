'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LocsMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      locs_oid: {
        type: Sequelize.UUID
      },
      locs_en_id: {
        type: Sequelize.INTEGER
      },
      locs_id: {
        type: Sequelize.INTEGER
      },
      locs_loc_id: {
        type: Sequelize.INTEGER
      },
      locs_add_date: {
        type: Sequelize.DATE
      },
      locs_add_by: {
        type: Sequelize.STRING
      },
      locs_upd_date: {
        type: Sequelize.DATE
      },
      locs_upd_by: {
        type: Sequelize.STRING
      },
      locs_name: {
        type: Sequelize.STRING
      },
      locs_floor_id: {
        type: Sequelize.INTEGER
      },
      locs_block_code: {
        type: Sequelize.STRING
      },
      locs_rack_no: {
        type: Sequelize.INTEGER
      },
      locs_row_no: {
        type: Sequelize.INTEGER
      },
      locs_column_no: {
        type: Sequelize.INTEGER
      },
      locs_shelf_id: {
        type: Sequelize.INTEGER
      },
      locs_subcat_id: {
        type: Sequelize.INTEGER
      },
      locs_cap: {
        type: Sequelize.INTEGER
      },
      locs_remarks: {
        type: Sequelize.STRING
      },
      locs_active: {
        type: Sequelize.STRING
      },
      locs_admit_inv: {
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
    await queryInterface.dropTable('LocsMstrs');
  }
};
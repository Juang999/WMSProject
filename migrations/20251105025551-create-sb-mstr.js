'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SbMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sb_oid: {
        type: Sequelize.UUID
      },
      sb_dom_id: {
        type: Sequelize.INTEGER
      },
      sb_en_id: {
        type: Sequelize.INTEGER
      },
      sb_add_by: {
        type: Sequelize.STRING
      },
      sb_add_date: {
        type: Sequelize.DATE
      },
      sb_upd_by: {
        type: Sequelize.STRING
      },
      sb_upd_date: {
        type: Sequelize.DATE
      },
      sb_id: {
        type: Sequelize.INTEGER
      },
      sb_code: {
        type: Sequelize.STRING
      },
      sb_desc: {
        type: Sequelize.STRING
      },
      sb_active: {
        type: Sequelize.STRING
      },
      sb_dt: {
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
    await queryInterface.dropTable('SbMstrs');
  }
};
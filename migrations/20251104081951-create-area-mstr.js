'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AreaMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      area_oid: {
        type: Sequelize.UUID
      },
      area_dom_id: {
        type: Sequelize.INTEGER
      },
      area_add_by: {
        type: Sequelize.STRING
      },
      area_add_date: {
        type: Sequelize.DATE
      },
      area_upd_by: {
        type: Sequelize.STRING
      },
      area_upd_date: {
        type: Sequelize.DATE
      },
      area_id: {
        type: Sequelize.INTEGER
      },
      area_code: {
        type: Sequelize.STRING
      },
      area_name: {
        type: Sequelize.STRING
      },
      area_desc: {
        type: Sequelize.STRING
      },
      area_parent: {
        type: Sequelize.INTEGER
      },
      area_dt: {
        type: Sequelize.DATE
      },
      area_active: {
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
    await queryInterface.dropTable('AreaMstrs');
  }
};
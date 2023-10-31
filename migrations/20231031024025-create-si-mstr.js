'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SiMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      si_oid: {
        type: Sequelize.UUID
      },
      si_dom_id: {
        type: Sequelize.INTEGER
      },
      si_en_id: {
        type: Sequelize.INTEGER
      },
      si_add_by: {
        type: Sequelize.STRING
      },
      si_add_date: {
        type: Sequelize.DATE
      },
      si_upd_by: {
        type: Sequelize.STRING
      },
      si_upd_date: {
        type: Sequelize.DATE
      },
      si_id: {
        type: Sequelize.INTEGER
      },
      si_code: {
        type: Sequelize.STRING
      },
      si_desc: {
        type: Sequelize.STRING
      },
      si_active: {
        type: Sequelize.STRING
      },
      si_dt: {
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
    await queryInterface.dropTable('SiMstrs');
  }
};
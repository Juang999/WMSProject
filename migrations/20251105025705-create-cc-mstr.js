'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CcMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cc_oid: {
        type: Sequelize.UUID
      },
      cc_dom_id: {
        type: Sequelize.INTEGER
      },
      cc_en_id: {
        type: Sequelize.INTEGER
      },
      cc_add_by: {
        type: Sequelize.STRING
      },
      cc_add_date: {
        type: Sequelize.DATE
      },
      cc_upd_by: {
        type: Sequelize.STRING
      },
      cc_upd_date: {
        type: Sequelize.DATE
      },
      cc_id: {
        type: Sequelize.INTEGER
      },
      cc_code: {
        type: Sequelize.STRING
      },
      cc_desc: {
        type: Sequelize.STRING
      },
      cc_active: {
        type: Sequelize.STRING
      },
      cc_dt: {
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
    await queryInterface.dropTable('CcMstrs');
  }
};
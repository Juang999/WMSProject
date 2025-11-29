'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BkMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bk_oid: {
        type: Sequelize.UUID
      },
      bk_dom_id: {
        type: Sequelize.INTEGER
      },
      bk_en_id: {
        type: Sequelize.INTEGER
      },
      bk_add_by: {
        type: Sequelize.STRING
      },
      bk_add_date: {
        type: Sequelize.DATE
      },
      bk_upd_by: {
        type: Sequelize.STRING
      },
      bk_upd_date: {
        type: Sequelize.DATE
      },
      bk_id: {
        type: Sequelize.INTEGER
      },
      bk_code: {
        type: Sequelize.STRING
      },
      bk_name: {
        type: Sequelize.STRING
      },
      bk_cu_id: {
        type: Sequelize.INTEGER
      },
      bk_ac_id: {
        type: Sequelize.INTEGER
      },
      bk_cc_id: {
        type: Sequelize.INTEGER
      },
      bk_sb_id: {
        type: Sequelize.INTEGER
      },
      bk_active: {
        type: Sequelize.STRING
      },
      bk_dt: {
        type: Sequelize.DATE
      },
      bk_account: {
        type: Sequelize.STRING
      },
      bk_an: {
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
    await queryInterface.dropTable('BkMstrs');
  }
};
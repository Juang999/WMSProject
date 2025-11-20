'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GlBalBalances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      glbal_oid: {
        type: Sequelize.UUID
      },
      glbal_dom_id: {
        type: Sequelize.INTEGER
      },
      glbal_en_id: {
        type: Sequelize.INTEGER
      },
      glbal_add_by: {
        type: Sequelize.STRING
      },
      glbal_add_date: {
        type: Sequelize.DATE
      },
      glbal_upd_by: {
        type: Sequelize.STRING
      },
      glbal_upd_date: {
        type: Sequelize.DATE
      },
      glbal_gcal_oid: {
        type: Sequelize.UUID
      },
      glbal_ac_id: {
        type: Sequelize.INTEGER
      },
      glbal_sb_id: {
        type: Sequelize.INTEGER
      },
      glbal_cc_id: {
        type: Sequelize.INTEGER
      },
      glbal_cu_id: {
        type: Sequelize.INTEGER
      },
      glbal_balance_open: {
        type: Sequelize.INTEGER
      },
      glbal_balance_unposted: {
        type: Sequelize.INTEGER
      },
      glbal_balance_posted: {
        type: Sequelize.INTEGER
      },
      glbal_dt: {
        type: Sequelize.DATE
      },
      glbal_balance_posted_end_month: {
        type: Sequelize.INTEGER
      },
      glbal_balance_trial: {
        type: Sequelize.INTEGER
      },
      glbal_balance_end_month1: {
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
    await queryInterface.dropTable('GlBalBalances');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AcMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ac_oid: {
        type: Sequelize.UUID
      },
      ac_dom_id: {
        type: Sequelize.INTEGER
      },
      ac_add_by: {
        type: Sequelize.STRING
      },
      ac_add_date: {
        type: Sequelize.DATE
      },
      ac_upd_by: {
        type: Sequelize.STRING
      },
      ac_upd_date: {
        type: Sequelize.DATE
      },
      ac_id: {
        type: Sequelize.INTEGER
      },
      ac_code: {
        type: Sequelize.STRING
      },
      ac_name: {
        type: Sequelize.STRING
      },
      ac_desc: {
        type: Sequelize.STRING
      },
      ac_parent: {
        type: Sequelize.INTEGER
      },
      ac_type: {
        type: Sequelize.STRING
      },
      ac_is_sumlevel: {
        type: Sequelize.STRING
      },
      ac_sign: {
        type: Sequelize.STRING
      },
      ac_active: {
        type: Sequelize.STRING
      },
      ac_dt: {
        type: Sequelize.DATE
      },
      ac_subclass: {
        type: Sequelize.INTEGER
      },
      ac_subclass_2: {
        type: Sequelize.INTEGER
      },
      ac_subclass_3: {
        type: Sequelize.INTEGER
      },
      ac_cu_id: {
        type: Sequelize.INTEGER
      },
      ac_cash_flow: {
        type: Sequelize.INTEGER
      },
      ac_in_cash_flow: {
        type: Sequelize.STRING
      },
      ac_is_budget: {
        type: Sequelize.STRING
      },
      ac_code_hirarki: {
        type: Sequelize.STRING
      },
      ac_level: {
        type: Sequelize.INTEGER
      },
      ac_priority: {
        type: Sequelize.INTEGER
      },
      ac_is_cf: {
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
    await queryInterface.dropTable('AcMstrs');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CuMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cu_oid: {
        type: Sequelize.UUID
      },
      cu_add_by: {
        type: Sequelize.STRING
      },
      cu_add_date: {
        type: Sequelize.DATE
      },
      cu_upd_by: {
        type: Sequelize.STRING
      },
      cu_upd_date: {
        type: Sequelize.DATE
      },
      cu_id: {
        type: Sequelize.INTEGER
      },
      cu_code: {
        type: Sequelize.STRING
      },
      cu_name: {
        type: Sequelize.STRING
      },
      cu_symbol: {
        type: Sequelize.STRING
      },
      cu_desc: {
        type: Sequelize.STRING
      },
      cu_active: {
        type: Sequelize.STRING
      },
      cu_dt: {
        type: Sequelize.DATE
      },
      cu_ac_unreal_exc_gain_id: {
        type: Sequelize.INTEGER
      },
      cu_ac_unreal_exc_lost_id: {
        type: Sequelize.INTEGER
      },
      cu_ac_real_exc_gain_id: {
        type: Sequelize.INTEGER
      },
      cu_ac_real_exc_lost_id: {
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
    await queryInterface.dropTable('CuMstrs');
  }
};
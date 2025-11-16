'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GCalMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gcal_oid: {
        type: Sequelize.UUID
      },
      gcal_dom_id: {
        type: Sequelize.INTEGER
      },
      gcal_add_by: {
        type: Sequelize.STRING
      },
      gcal_add_date: {
        type: Sequelize.DATE
      },
      gcal_upd_by: {
        type: Sequelize.STRING
      },
      gcal_upd_date: {
        type: Sequelize.DATE
      },
      gcal_year: {
        type: Sequelize.INTEGER
      },
      gcal_periode: {
        type: Sequelize.INTEGER
      },
      gcal_start_date: {
        type: Sequelize.DATEONLY
      },
      gcal_end_date: {
        type: Sequelize.DATEONLY
      },
      gcal_dt: {
        type: Sequelize.DATE
      },
      gcal_pra_closing: {
        type: Sequelize.STRING
      },
      gcal_closing: {
        type: Sequelize.STRING
      },
      gcal_generate_status: {
        type: Sequelize.STRING
      },
      gcal_gen_01: {
        type: Sequelize.STRING
      },
      gcal_gen_02: {
        type: Sequelize.STRING
      },
      gcal_gen_03: {
        type: Sequelize.STRING
      },
      gcal_gen_04: {
        type: Sequelize.STRING
      },
      gcal_gen_05: {
        type: Sequelize.STRING
      },
      gcal_gen_06: {
        type: Sequelize.STRING
      },
      gcal_gen_07: {
        type: Sequelize.STRING
      },
      gcal_gen_08: {
        type: Sequelize.STRING
      },
      gcal_gen_09: {
        type: Sequelize.STRING
      },
      gcal_gen_10: {
        type: Sequelize.STRING
      },
      gcal_gen_11: {
        type: Sequelize.STRING
      },
      gcal_gen_12: {
        type: Sequelize.STRING
      },
      gcal_gen_13: {
        type: Sequelize.STRING
      },
      gcal_gen_14: {
        type: Sequelize.STRING
      },
      gcal_gen_15: {
        type: Sequelize.STRING
      },
      gcal_gen_16: {
        type: Sequelize.STRING
      },
      gcal_gen_17: {
        type: Sequelize.STRING
      },
      gcal_gen_18: {
        type: Sequelize.STRING
      },
      gcal_gen_19: {
        type: Sequelize.STRING
      },
      gcal_gen_20: {
        type: Sequelize.STRING
      },
      gcal_gen_21: {
        type: Sequelize.STRING
      },
      gcal_gen_22: {
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
    await queryInterface.dropTable('GCalMstrs');
  }
};
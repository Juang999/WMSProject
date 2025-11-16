'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PsdDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      psd_oid: {
        type: Sequelize.UUID
      },
      psd_ps_oid: {
        type: Sequelize.UUID
      },
      psd_add_by: {
        type: Sequelize.STRING
      },
      psd_add_date: {
        type: Sequelize.DATE
      },
      psd_upd_by: {
        type: Sequelize.STRING
      },
      psd_upd_date: {
        type: Sequelize.DATE
      },
      psd_use_bom: {
        type: Sequelize.STRING
      },
      psd_pt_bom_id: {
        type: Sequelize.INTEGER
      },
      psd_comp: {
        type: Sequelize.STRING
      },
      psd_ref: {
        type: Sequelize.STRING
      },
      psd_desc: {
        type: Sequelize.STRING
      },
      psd_start_date: {
        type: Sequelize.DATEONLY
      },
      psd_end_date: {
        type: Sequelize.DATEONLY
      },
      psd_qty: {
        type: Sequelize.INTEGER
      },
      psd_str_type: {
        type: Sequelize.STRING
      },
      psd_scrp_pct: {
        type: Sequelize.INTEGER
      },
      psd_lt_off: {
        type: Sequelize.INTEGER
      },
      psd_op: {
        type: Sequelize.INTEGER
      },
      psd_seq: {
        type: Sequelize.INTEGER
      },
      psd_fcst_pct: {
        type: Sequelize.INTEGER
      },
      psd_group: {
        type: Sequelize.INTEGER
      },
      psd_process: {
        type: Sequelize.INTEGER
      },
      psd_dt: {
        type: Sequelize.DATE
      },
      psd_qty_plan: {
        type: Sequelize.INTEGER
      },
      psd_qty_variance: {
        type: Sequelize.INTEGER
      },
      psd_indirect: {
        type: Sequelize.STRING
      },
      psd_yield_pct: {
        type: Sequelize.INTEGER
      },
      psd_insheet_pct: {
        type: Sequelize.INTEGER
      },
      psd_en_id: {
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
    await queryInterface.dropTable('PsdDets');
  }
};
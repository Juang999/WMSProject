'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PsMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ps_oid: {
        type: Sequelize.UUID
      },
      ps_dom_id: {
        type: Sequelize.INTEGER
      },
      ps_en_id: {
        type: Sequelize.INTEGER
      },
      ps_add_by: {
        type: Sequelize.STRING
      },
      ps_add_date: {
        type: Sequelize.DATE
      },
      ps_upd_by: {
        type: Sequelize.STRING
      },
      ps_upd_date: {
        type: Sequelize.DATE
      },
      ps_id: {
        type: Sequelize.INTEGER
      },
      ps_par: {
        type: Sequelize.STRING
      },
      ps_desc: {
        type: Sequelize.STRING
      },
      ps_use_bom: {
        type: Sequelize.STRING
      },
      ps_pt_bom_id: {
        type: Sequelize.INTEGER
      },
      ps_active: {
        type: Sequelize.STRING
      },
      ps_dt: {
        type: Sequelize.DATE
      },
      ps_rev: {
        type: Sequelize.INTEGER
      },
      ps_remarks: {
        type: Sequelize.STRING
      },
      ps_tran_id: {
        type: Sequelize.INTEGER
      },
      ps_trans_id: {
        type: Sequelize.STRING
      },
      ps_ratio: {
        type: Sequelize.INTEGER
      },
      ps_is_assembly: {
        type: Sequelize.STRING
      },
      ps_pi_id: {
        type: Sequelize.INTEGER
      },
      ps_pi_oid: {
        type: Sequelize.UUID
      },
      ps_single: {
        type: Sequelize.STRING
      },
      ps_trans_code: {
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
    await queryInterface.dropTable('PsMstrs');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GltDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      glt_oid: {
        type: Sequelize.UUID
      },
      glt_dom_id: {
        type: Sequelize.INTEGER
      },
      glt_en_id: {
        type: Sequelize.INTEGER
      },
      glt_add_by: {
        type: Sequelize.STRING
      },
      glt_add_date: {
        type: Sequelize.DATE
      },
      glt_upd_by: {
        type: Sequelize.STRING
      },
      glt_upd_date: {
        type: Sequelize.DATE
      },
      glt_gl_oid: {
        type: Sequelize.UUID
      },
      glt_code: {
        type: Sequelize.STRING
      },
      glt_date: {
        type: Sequelize.DATEONLY
      },
      glt_type: {
        type: Sequelize.STRING
      },
      glt_cu_id: {
        type: Sequelize.INTEGER
      },
      glt_exc_rate: {
        type: Sequelize.INTEGER
      },
      glt_seq: {
        type: Sequelize.INTEGER
      },
      glt_ac_id: {
        type: Sequelize.INTEGER
      },
      glt_sb_id: {
        type: Sequelize.INTEGER
      },
      glt_cc_id: {
        type: Sequelize.INTEGER
      },
      glt_desc: {
        type: Sequelize.STRING
      },
      glt_debit: {
        type: Sequelize.INTEGER
      },
      glt_credit: {
        type: Sequelize.INTEGER
      },
      glt_ref_tran_id: {
        type: Sequelize.INTEGER
      },
      glt_ref_trans_code: {
        type: Sequelize.STRING
      },
      glt_posted: {
        type: Sequelize.STRING
      },
      glt_dt: {
        type: Sequelize.DATE
      },
      glt_daybook: {
        type: Sequelize.STRING
      },
      glt_ref_oid: {
        type: Sequelize.UUID
      },
      glt_is_reverse: {
        type: Sequelize.STRING
      },
      glt_is_gen_ros: {
        type: Sequelize.STRING
      },
      glt_desc_detail: {
        type: Sequelize.STRING
      },
      glt_ref_detail_no: {
        type: Sequelize.STRING
      },
      glt_check_status: {
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
    await queryInterface.dropTable('GltDets');
  }
};
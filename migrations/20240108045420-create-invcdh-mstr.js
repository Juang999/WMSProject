'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InvcdhMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invcdh_oid: {
        type: Sequelize.UUID
      },
      invcdh_tran_id: {
        type: Sequelize.INTEGER
      },
      invcdh_seq: {
        type: Sequelize.INTEGER
      },
      invcdh_dom_id: {
        type: Sequelize.INTEGER
      },
      invcdh_en_id: {
        type: Sequelize.INTEGER
      },
      invcdh_trn_code: {
        type: Sequelize.STRING
      },
      invcdh_date: {
        type: Sequelize.DATE
      },
      invcdh_desc: {
        type: Sequelize.STRING
      },
      invcdh_opn_type: {
        type: Sequelize.STRING
      },
      invcdh_si_id: {
        type: Sequelize.INTEGER
      },
      invcdh_loc_id: {
        type: Sequelize.INTEGER
      },
      invcdh_locs_id: {
        type: Sequelize.INTEGER
      },
      invcdh_qty_new: {
        type: Sequelize.INTEGER
      },
      invcdh_qty_old: {
        type: Sequelize.INTEGER
      },
      invcdh_add_by: {
        type: Sequelize.STRING
      },
      invcdh_add_date: {
        type: Sequelize.DATE
      },
      invcdh_upd_by: {
        type: Sequelize.STRING
      },
      invcdh_upd_date: {
        type: Sequelize.DATE
      },
      invcdh_cost: {
        type: Sequelize.INTEGER
      },
      invcdh_avg_cost: {
        type: Sequelize.INTEGER
      },
      invcdh_trn_oid: {
        type: Sequelize.UUID
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
    await queryInterface.dropTable('InvcdhMstrs');
  }
};
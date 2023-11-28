'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CcremMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ccrem_date: {
        type: Sequelize.DATE
      },
      ccrem_add_by: {
        type: Sequelize.STRING
      },
      ccrem_add_date: {
        type: Sequelize.DATE
      },
      ccrem_upd_by: {
        type: Sequelize.STRING
      },
      ccrem_upd_date: {
        type: Sequelize.DATE
      },
      ccrem_type: {
        type: Sequelize.STRING
      },
      ccrem_pt_id: {
        type: Sequelize.INTEGER
      },
      ccrem_si_id: {
        type: Sequelize.INTEGER
      },
      ccrem_loc_id: {
        type: Sequelize.INTEGER
      },
      ccrem_locs_id: {
        type: Sequelize.INTEGER
      },
      ccrem_lot_serial: {
        type: Sequelize.STRING
      },
      ccrem_qty: {
        type: Sequelize.INTEGER
      },
      ccrem_um_id: {
        type: Sequelize.INTEGER
      },
      ccrem_um_conv: {
        type: Sequelize.INTEGER
      },
      ccrem_qty_real: {
        type: Sequelize.INTEGER
      },
      ccrem_cost: {
        type: Sequelize.INTEGER
      },
      ccrem_dt: {
        type: Sequelize.DATE
      },
      ccrem_en_id: {
        type: Sequelize.INTEGER
      },
      ccrem_oid: {
        type: Sequelize.UUID
      },
      ccrem_qty_old: {
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
    await queryInterface.dropTable('CcremMstrs');
  }
};
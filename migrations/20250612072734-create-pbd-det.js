'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PbdDets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pbd_oid: {
        type: Sequelize.UUID
      },
      pbd_dom_id: {
        type: Sequelize.INTEGER
      },
      pbd_en_id: {
        type: Sequelize.INTEGER
      },
      pbd_add_by: {
        type: Sequelize.STRING
      },
      pbd_add_date: {
        type: Sequelize.DATE
      },
      pbd_upd_by: {
        type: Sequelize.STRING
      },
      pbd_upd_date: {
        type: Sequelize.DATE
      },
      pbd_pb_oid: {
        type: Sequelize.UUID
      },
      pbd_seq: {
        type: Sequelize.INTEGER
      },
      pbd_pt_id: {
        type: Sequelize.INTEGER
      },
      pbd_rmks: {
        type: Sequelize.STRING
      },
      pbd_end_user: {
        type: Sequelize.STRING
      },
      pbd_qty: {
        type: Sequelize.INTEGER
      },
      pbd_qty_processed: {
        type: Sequelize.INTEGER
      },
      pbd_qty_completed: {
        type: Sequelize.INTEGER
      },
      pbd_um: {
        type: Sequelize.INTEGER
      },
      pbd_due_date: {
        type: Sequelize.DATE
      },
      pbd_status: {
        type: Sequelize.STRING
      },
      pbd_dt: {
        type: Sequelize.DATE
      },
      pbd_si_id: {
        type: Sequelize.INTEGER
      },
      pbd_qty_riud: {
        type: Sequelize.INTEGER
      },
      pbd_pb2det_oid: {
        type: Sequelize.UUID
      },
      pbd_pb2_code: {
        type: Sequelize.STRING
      },
      pbd_pb2_oid: {
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
    await queryInterface.dropTable('PbdDets');
  }
};
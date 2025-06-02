'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PtsfrdsSerials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ptsfrds_oid: {
        type: Sequelize.UUID
      },
      ptsfrds_ptsfrd_oid: {
        type: Sequelize.UUID
      },
      ptsfrds_qty: {
        type: Sequelize.INTEGER
      },
      ptsfrds_qty_receive: {
        type: Sequelize.INTEGER
      },
      ptsfrds_si_id: {
        type: Sequelize.INTEGER
      },
      ptsfrds_loc_id: {
        type: Sequelize.INTEGER
      },
      ptsfrds_lot_serial: {
        type: Sequelize.STRING
      },
      ptsfrds_dt: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('PtsfrdsSerials');
  }
};
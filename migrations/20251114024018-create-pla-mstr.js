'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlaMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pla_oid: {
        type: Sequelize.UUID
      },
      pla_seq: {
        type: Sequelize.INTEGER
      },
      pla_param: {
        type: Sequelize.STRING
      },
      pla_code: {
        type: Sequelize.STRING
      },
      pla_desc: {
        type: Sequelize.STRING
      },
      pla_ac_id: {
        type: Sequelize.INTEGER
      },
      pla_sb_id: {
        type: Sequelize.INTEGER
      },
      pla_cc_id: {
        type: Sequelize.INTEGER
      },
      pla_dt: {
        type: Sequelize.DATE
      },
      pla_pl_id: {
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
    await queryInterface.dropTable('PlaMstrs');
  }
};
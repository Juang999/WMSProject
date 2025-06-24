'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PtsCatCats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ptscat_oid: {
        type: Sequelize.UUID
      },
      ptscat_code: {
        type: Sequelize.STRING
      },
      ptscat_id: {
        type: Sequelize.INTEGER
      },
      ptscat_ptcat_id: {
        type: Sequelize.INTEGER
      },
      ptscat_desc: {
        type: Sequelize.STRING
      },
      ptscat_add_by: {
        type: Sequelize.STRING
      },
      ptscat_add_date: {
        type: Sequelize.DATE
      },
      ptscat_upd_by: {
        type: Sequelize.STRING
      },
      ptscat_upd_date: {
        type: Sequelize.DATE
      },
      ptscat_active: {
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
    await queryInterface.dropTable('PtsCatCats');
  }
};
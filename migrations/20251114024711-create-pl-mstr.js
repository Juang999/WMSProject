'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pl_oid: {
        type: Sequelize.UUID
      },
      pl_dom_id: {
        type: Sequelize.INTEGER
      },
      pl_add_by: {
        type: Sequelize.STRING
      },
      pl_add_date: {
        type: Sequelize.DATE
      },
      pl_upd_by: {
        type: Sequelize.STRING
      },
      pl_upd_date: {
        type: Sequelize.DATE
      },
      pl_id: {
        type: Sequelize.INTEGER
      },
      pl_code: {
        type: Sequelize.STRING
      },
      pl_desc: {
        type: Sequelize.STRING
      },
      pl_taxable: {
        type: Sequelize.STRING
      },
      pl_tax_class: {
        type: Sequelize.INTEGER
      },
      pl_active: {
        type: Sequelize.STRING
      },
      pl_dt: {
        type: Sequelize.DATE
      },
      pl_fa_depr: {
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
    await queryInterface.dropTable('PlMstrs');
  }
};
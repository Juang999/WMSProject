'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SokpPiutangs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sokp_oid: {
        type: Sequelize.UUID
      },
      sokp_so_oid: {
        type: Sequelize.UUID
      },
      sokp_seq: {
        type: Sequelize.INTEGER
      },
      sokp_amount: {
        type: Sequelize.DECIMAL
      },
      sokp_amount_pay: {
        type: Sequelize.DECIMAL
      },
      sokp_description: {
        type: Sequelize.STRING
      },
      sokp_due_date: {
        type: Sequelize.DATEONLY
      },
      sokp_status: {
        type: Sequelize.STRING
      },
      sokp_ar_oid: {
        type: Sequelize.UUID
      },
      sokp_ref: {
        type: Sequelize.STRING
      },
      sokp_date_payment: {
        type: Sequelize.DATEONLY
      },
      sokp_add_by: {
        type: Sequelize.STRING
      },
      sokp_upd_by: {
        type: Sequelize.STRING
      },
      sokp_add_date: {
        type: Sequelize.DATE
      },
      sokp_upd_date: {
        type: Sequelize.DATE
      },
      sokp_sq_oid: {
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
    await queryInterface.dropTable('SokpPiutangs');
  }
};
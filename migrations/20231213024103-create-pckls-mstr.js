'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PcklsMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pckls_oid: {
        type: Sequelize.UUID
      },
      pckls_dom_id: {
        type: Sequelize.INTEGER
      },
      pckls_en_id: {
        type: Sequelize.INTEGER
      },
      pckls_add_by: {
        type: Sequelize.STRING
      },
      pckls_add_date: {
        type: Sequelize.DATE
      },
      pckls_upd_by: {
        type: Sequelize.STRING
      },
      pckls_upd_date: {
        type: Sequelize.DATE
      },
      pckls_code: {
        type: Sequelize.STRING
      },
      pckls_sold_to: {
        type: Sequelize.INTEGER
      },
      pckls_date: {
        type: Sequelize.DATE
      },
      pckls_eff_date: {
        type: Sequelize.DATE
      },
      pckls_expt_date: {
        type: Sequelize.DATE
      },
      pckls_remarks: {
        type: Sequelize.STRING
      },
      pckls_status: {
        type: Sequelize.STRING
      },
      pckls_dt: {
        type: Sequelize.DATE
      },
      pckls_shipping_charges: {
        type: Sequelize.INTEGER
      },
      pckls_total_final: {
        type: Sequelize.INTEGER
      },
      pckls_arp_code: {
        type: Sequelize.UUID
      },
      pckls_arp_oid: {
        type: Sequelize.UUID
      },
      pckls_shipment: {
        type: Sequelize.STRING
      },
      pckls_shipment_date: {
        type: Sequelize.DATE
      },
      pckls_bill_to: {
        type: Sequelize.INTEGER
      },
      pckls_due_date: {
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
    await queryInterface.dropTable('PcklsMstrs');
  }
};
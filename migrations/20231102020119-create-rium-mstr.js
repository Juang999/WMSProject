'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RiumMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rium_oid: {
        type: Sequelize.UUID
      },
      rium_dom_id: {
        type: Sequelize.INTEGER
      },
      rium_en_id: {
        type: Sequelize.INTEGER
      },
      rium_add_by: {
        type: Sequelize.STRING
      },
      rium_add_date: {
        type: Sequelize.DATE
      },
      rium_upd_by: {
        type: Sequelize.STRING
      },
      rium_upd_date: {
        type: Sequelize.DATE
      },
      rium_type2: {
        type: Sequelize.STRING
      },
      rium_date: {
        type: Sequelize.DATE
      },
      rium_type: {
        type: Sequelize.STRING
      },
      rium_remarks: {
        type: Sequelize.STRING
      },
      rium_dt: {
        type: Sequelize.DATE
      },
      rium_ref_so_code: {
        type: Sequelize.STRING
      },
      rium_ref_so_oid: {
        type: Sequelize.UUID
      },
      rium_ref_pb_oid: {
        type: Sequelize.UUID
      },
      rium_ref_pb_code: {
        type: Sequelize.STRING
      },
      rium_is_sample: {
        type: Sequelize.STRING
      },
      rium_cost_total: {
        type: Sequelize.INTEGER
      },
      rium_ref_ar_code: {
        type: Sequelize.STRING
      },
      rium_ref_ar_oid: {
        type: Sequelize.UUID
      },
      rium_ptnr_id: {
        type: Sequelize.INTEGER
      },
      rium_pack_vend: {
        type: Sequelize.STRING
      },
      rium_status: {
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
    await queryInterface.dropTable('RiumMstrs');
  }
};
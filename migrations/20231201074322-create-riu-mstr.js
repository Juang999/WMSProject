'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RiuMstrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      riu_oid: {
        type: Sequelize.UUID
      },
      riu_dom_id: {
        type: Sequelize.INTEGER
      },
      riu_en_id: {
        type: Sequelize.INTEGER
      },
      riu_add_by: {
        type: Sequelize.STRING
      },
      riu_add_date: {
        type: Sequelize.DATE
      },
      riu_upd_by: {
        type: Sequelize.STRING
      },
      riu_upd_date: {
        type: Sequelize.DATE
      },
      riu_type2: {
        type: Sequelize.STRING
      },
      riu_date: {
        type: Sequelize.DATE
      },
      riu_type: {
        type: Sequelize.STRING
      },
      riu_remarks: {
        type: Sequelize.STRING
      },
      riu_dt: {
        type: Sequelize.DATE
      },
      riu_ref_so_code: {
        type: Sequelize.STRING
      },
      riu_ref_so_oid: {
        type: Sequelize.UUID
      },
      riu_ref_pb_oid: {
        type: Sequelize.UUID
      },
      riu_ref_pb_code: {
        type: Sequelize.STRING
      },
      riu_is_sample: {
        type: Sequelize.STRING
      },
      riu_cost_total: {
        type: Sequelize.INTEGER
      },
      riu_ref_ar_code: {
        type: Sequelize.STRING
      },
      riu_ref_ar_oid: {
        type: Sequelize.UUID
      },
      riu_ptnr_id: {
        type: Sequelize.INTEGER
      },
      riu_pack_vend: {
        type: Sequelize.STRING
      },
      riu_type_code_id: {
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
    await queryInterface.dropTable('RiuMstrs');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SoaAttrs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      soa_oid: {
        type: Sequelize.UUID
      },
      soa_bekerja_pada: {
        type: Sequelize.STRING
      },
      soa_jabatan_bagian: {
        type: Sequelize.STRING
      },
      soa_kantor_alamat_1: {
        type: Sequelize.STRING
      },
      soa_kantor_alamat_2: {
        type: Sequelize.STRING
      },
      soa_kantor_lantai: {
        type: Sequelize.STRING
      },
      soa_kantor_telp: {
        type: Sequelize.STRING
      },
      soa_ktp: {
        type: Sequelize.STRING
      },
      soa_email: {
        type: Sequelize.STRING
      },
      soa_rumah_alamat_1: {
        type: Sequelize.STRING
      },
      soa_rumah_alamat_2: {
        type: Sequelize.STRING
      },
      soa_rumah_kode_pos: {
        type: Sequelize.STRING
      },
      soa_rumah_telp: {
        type: Sequelize.STRING
      },
      soa_rumah_hp: {
        type: Sequelize.STRING
      },
      soa_status_alamat_kirim: {
        type: Sequelize.STRING
      },
      soa_status_alamat_tagih: {
        type: Sequelize.STRING
      },
      soa_suami_nama: {
        type: Sequelize.STRING
      },
      soa_suami_bekerja: {
        type: Sequelize.STRING
      },
      soa_suami_jabatan: {
        type: Sequelize.STRING
      },
      soa_suami_kantor_alamat_1: {
        type: Sequelize.STRING
      },
      soa_suami_kantor_alamat_2: {
        type: Sequelize.STRING
      },
      soa_suami_telp: {
        type: Sequelize.STRING
      },
      soa_suami_hp: {
        type: Sequelize.STRING
      },
      soa_anak_nama_1: {
        type: Sequelize.STRING
      },
      soa_anak_tgl_lahir_1: {
        type: Sequelize.STRING
      },
      soa_anak_sekolah_1: {
        type: Sequelize.STRING
      },
      soa_anak_nama_2: {
        type: Sequelize.STRING
      },
      soa_anak_tgl_lahir_2: {
        type: Sequelize.STRING
      },
      soa_anak_sekolah_2: {
        type: Sequelize.STRING
      },
      soa_anak_nama_3: {
        type: Sequelize.STRING
      },
      soa_anak_tgl_lahir_3: {
        type: Sequelize.STRING
      },
      soa_anak_sekolah_3: {
        type: Sequelize.STRING
      },
      soa_keluarga_dekat_nama: {
        type: Sequelize.STRING
      },
      soa_keluarga_dekat_alamat_1: {
        type: Sequelize.STRING
      },
      soa_keluarga_dekat_alamat_2: {
        type: Sequelize.STRING
      },
      soa_keluarga_dekat_telp: {
        type: Sequelize.STRING
      },
      soa_keluarga_dekat_hp: {
        type: Sequelize.STRING
      },
      soa_status_tempat_tinggal: {
        type: Sequelize.STRING
      },
      soa_jenis_kartu_kredit: {
        type: Sequelize.STRING
      },
      soa_no_kartu_kredit: {
        type: Sequelize.STRING
      },
      soa_bank: {
        type: Sequelize.INTEGER
      },
      soa_berlaku_sd: {
        type: Sequelize.DATEONLY
      },
      soa_dt: {
        type: Sequelize.DATE
      },
      soa_kjb_code: {
        type: Sequelize.STRING
      },
      soa_so_oid: {
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
    await queryInterface.dropTable('SoaAttrs');
  }
};
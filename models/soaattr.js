'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SoaAttr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SoaAttr.belongsTo(models.BkMstr, {
        as: 'bank_relation',
        targetKey: 'bk_id',
        foreignKey: 'soa_bank'
      })
    }
  }
  SoaAttr.init({
    soa_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    soa_bekerja_pada: DataTypes.STRING,
    soa_jabatan_bagian: DataTypes.STRING,
    soa_kantor_alamat_1: DataTypes.STRING,
    soa_kantor_alamat_2: DataTypes.STRING,
    soa_kantor_lantai: DataTypes.STRING,
    soa_kantor_telp: DataTypes.STRING,
    soa_ktp: DataTypes.STRING,
    soa_email: DataTypes.STRING,
    soa_rumah_alamat_1: DataTypes.STRING,
    soa_rumah_alamat_2: DataTypes.STRING,
    soa_rumah_kode_pos: DataTypes.STRING,
    soa_rumah_telp: DataTypes.STRING,
    soa_rumah_hp: DataTypes.STRING,
    soa_status_alamat_kirim: DataTypes.STRING,
    soa_status_alamat_tagih: DataTypes.STRING,
    soa_suami_nama: DataTypes.STRING,
    soa_suami_bekerja: DataTypes.STRING,
    soa_suami_jabatan: DataTypes.STRING,
    soa_suami_kantor_alamat_1: DataTypes.STRING,
    soa_suami_kantor_alamat_2: DataTypes.STRING,
    soa_suami_telp: DataTypes.STRING,
    soa_suami_hp: DataTypes.STRING,
    soa_anak_nama_1: DataTypes.STRING,
    soa_anak_tgl_lahir_1: DataTypes.STRING,
    soa_anak_sekolah_1: DataTypes.STRING,
    soa_anak_nama_2: DataTypes.STRING,
    soa_anak_tgl_lahir_2: DataTypes.STRING,
    soa_anak_sekolah_2: DataTypes.STRING,
    soa_anak_nama_3: DataTypes.STRING,
    soa_anak_tgl_lahir_3: DataTypes.STRING,
    soa_anak_sekolah_3: DataTypes.STRING,
    soa_keluarga_dekat_nama: DataTypes.STRING,
    soa_keluarga_dekat_alamat_1: DataTypes.STRING,
    soa_keluarga_dekat_alamat_2: DataTypes.STRING,
    soa_keluarga_dekat_telp: DataTypes.STRING,
    soa_keluarga_dekat_hp: DataTypes.STRING,
    soa_status_tempat_tinggal: DataTypes.STRING,
    soa_jenis_kartu_kredit: DataTypes.STRING,
    soa_no_kartu_kredit: DataTypes.STRING,
    soa_bank: DataTypes.INTEGER,
    soa_berlaku_sd: DataTypes.DATEONLY,
    soa_dt: DataTypes.DATE,
    soa_kjb_code: DataTypes.STRING,
    soa_so_oid: DataTypes.UUID
  }, {
    sequelize,
    schema: 'public',
    tableName: 'soa_attr',
    timestamps: false,
    modelName: 'SoaAttr',
  });
  return SoaAttr;
};
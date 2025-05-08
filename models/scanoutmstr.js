'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScanOutMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ScanOutMstr.hasMany(models.ScanOutdDet, {
        sourceKey: 'sc_oid',
        foreignKey: 'scd_sc_oid',
        as: 'details',
      });

      ScanOutMstr.belongsTo(models.TransStatus, {
        as: 'transaction_status',
        targetKey: 'trans_id',
        foreignKey: 'sc_trans_id'
      })

      ScanOutMstr.hasOne(models.ScanOutdDet, {
        as: 'singular_details',
        sourceKey: 'sc_oid',
        foreignKey: 'scd_sc_oid',
      })
    }
  }
  ScanOutMstr.init({
    sc_oid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    sc_en_id: DataTypes.INTEGER,
    sc_code: DataTypes.STRING,
    sc_created_by: DataTypes.STRING,
    sc_created_at: DataTypes.DATE,
    sc_remarks: DataTypes.STRING,
    sc_date: DataTypes.DATEONLY,
    sc_pack_code: DataTypes.STRING,
    sc_so_code: DataTypes.STRING,
    sc_receiver_name: DataTypes.STRING,
    sc_trans_id: DataTypes.STRING,
    sc_updated_by: DataTypes.STRING,
    sc_updated_at: DataTypes.DATE,
  }, {
    sequelize,
    tableName: 'scanout_mstr',
    timestamps: false,
    schema: 'public',
    modelName: 'ScanOutMstr',
  });
  return ScanOutMstr;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiumMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RiumMstr.hasMany(models.RiumdDet, {
          as: 'detail_inventory_receipt',
          sourceKey: 'rium_oid',
          foreignKey: 'riumd_rium_oid'
      })
    }
  }
  RiumMstr.init({
    rium_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    rium_dom_id: DataTypes.INTEGER,
    rium_en_id: DataTypes.INTEGER,
    rium_add_by: DataTypes.STRING,
    rium_add_date: DataTypes.DATE,
    rium_upd_by: DataTypes.STRING,
    rium_upd_date: DataTypes.DATE,
    rium_type2: DataTypes.STRING,
    rium_date: DataTypes.DATE,
    rium_type: DataTypes.STRING,
    rium_remarks: DataTypes.STRING,
    rium_dt: DataTypes.DATE,
    rium_ref_so_code: DataTypes.STRING,
    rium_ref_so_oid: DataTypes.UUID,
    rium_ref_pb_oid: DataTypes.UUID,
    rium_ref_pb_code: DataTypes.STRING,
    rium_is_sample: DataTypes.STRING,
    rium_cost_total: DataTypes.INTEGER,
    rium_ref_ar_code: DataTypes.STRING,
    rium_ref_ar_oid: DataTypes.UUID,
    rium_ptnr_id: DataTypes.INTEGER,
    rium_pack_vend: DataTypes.STRING,
    rium_status: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'RiumMstr',
    tableName: 'rium_mstr',
    timestamps: false,
  });
  return RiumMstr;
};
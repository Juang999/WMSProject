'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiuMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RiuMstr.hasMany(models.RiudDet, {
        as: 'detail_receive_inventory',
        sourceKey: 'riu_oid',
        foreignKey: 'riud_riu_oid'
      })
    }
  }
  RiuMstr.init({
    riu_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    riu_dom_id: DataTypes.INTEGER,
    riu_en_id: DataTypes.INTEGER,
    riu_add_by: DataTypes.STRING,
    riu_add_date: DataTypes.DATE,
    riu_upd_by: DataTypes.STRING,
    riu_upd_date: DataTypes.DATE,
    riu_type2: DataTypes.STRING,
    riu_date: DataTypes.DATE,
    riu_type: DataTypes.STRING,
    riu_remarks: DataTypes.STRING,
    riu_dt: DataTypes.DATE,
    riu_ref_so_code: DataTypes.STRING,
    riu_ref_so_oid: DataTypes.UUID,
    riu_ref_pb_oid: DataTypes.UUID,
    riu_ref_pb_code: DataTypes.STRING,
    riu_is_sample: DataTypes.STRING,
    riu_cost_total: DataTypes.INTEGER,
    riu_ref_ar_code: DataTypes.STRING,
    riu_ref_ar_oid: DataTypes.UUID,
    riu_ptnr_id: DataTypes.INTEGER,
    riu_pack_vend: DataTypes.STRING,
    riu_type_code_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'riu_mstr',
    modelName: 'RiuMstr',
    timestamps: false
  });
  return RiuMstr;
};
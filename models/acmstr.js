'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AcMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AcMstr.hasMany(models.RiudDet, {
        as: 'detail_data_inventory_receipt',
        sourceKey: 'ac_id',
        foreignKey: 'riud_ac_id'
      })
    }
  }
  AcMstr.init({
    ac_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    ac_dom_id: DataTypes.INTEGER,
    ac_add_by: DataTypes.STRING,
    ac_add_date: DataTypes.DATE,
    ac_upd_by: DataTypes.STRING,
    ac_upd_date: DataTypes.DATE,
    ac_id: DataTypes.INTEGER,
    ac_code: DataTypes.STRING,
    ac_name: DataTypes.STRING,
    ac_desc: DataTypes.STRING,
    ac_parent: DataTypes.INTEGER,
    ac_type: DataTypes.STRING,
    ac_is_sumlevel: DataTypes.STRING,
    ac_sign: DataTypes.STRING,
    ac_active: DataTypes.STRING,
    ac_dt: DataTypes.DATE,
    ac_subclass: DataTypes.INTEGER,
    ac_subclass_2: DataTypes.INTEGER,
    ac_subclass_3: DataTypes.INTEGER,
    ac_cu_id: DataTypes.INTEGER,
    ac_cash_flow: DataTypes.INTEGER,
    ac_in_cash_flow: DataTypes.STRING,
    ac_is_budget: DataTypes.STRING,
    ac_code_hirarki: DataTypes.STRING,
    ac_level: DataTypes.INTEGER,
    ac_priority: DataTypes.INTEGER,
    ac_is_cf: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'AcMstr',
    tableName: 'ac_mstr',
    timestamps: false
  });
  return AcMstr;
};
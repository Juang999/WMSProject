'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CuMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CuMstr.init({
    cu_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    cu_add_by: DataTypes.STRING,
    cu_add_date: DataTypes.DATE,
    cu_upd_by: DataTypes.STRING,
    cu_upd_date: DataTypes.DATE,
    cu_id: DataTypes.INTEGER,
    cu_code: DataTypes.STRING,
    cu_name: DataTypes.STRING,
    cu_symbol: DataTypes.STRING,
    cu_desc: DataTypes.STRING,
    cu_active: DataTypes.STRING,
    cu_dt: DataTypes.DATE,
    cu_ac_unreal_exc_gain_id: DataTypes.INTEGER,
    cu_ac_unreal_exc_lost_id: DataTypes.INTEGER,
    cu_ac_real_exc_gain_id: DataTypes.INTEGER,
    cu_ac_real_exc_lost_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'cu_mstr',
    timestamps: false,
    modelName: 'CuMstr',
  });
  return CuMstr;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AreaMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AreaMstr.init({
    area_oid: {
      type: DataTypes.UUID,
      primaryKey: true,
      validate: {
        isUUID: true
      }
    },
    area_dom_id: DataTypes.INTEGER,
    area_add_by: DataTypes.STRING,
    area_add_date: DataTypes.DATE,
    area_upd_by: DataTypes.STRING,
    area_upd_date: DataTypes.DATE,
    area_id: DataTypes.INTEGER,
    area_code: DataTypes.STRING,
    area_name: DataTypes.STRING,
    area_desc: DataTypes.STRING,
    area_parent: DataTypes.INTEGER,
    area_dt: DataTypes.DATE,
    area_active: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'area_mstr',
    timestamps: false,
    modelName: 'AreaMstr',
  });
  return AreaMstr;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PbtType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PbtType.init({
    pbt_code: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    pbt_desc: DataTypes.STRING,
    pbt_active: DataTypes.STRING,
    pbt_add_by: DataTypes.STRING,
    pbt_add_date: DataTypes.DATE,
    pbt_upd_by: DataTypes.STRING,
    pbt_upd_date: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    tableName: 'pbt_type',
    timestamps: false,
    modelName: 'PbtType',
  });
  return PbtType;
};
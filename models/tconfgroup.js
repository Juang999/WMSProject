'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TConfGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TConfGroup.hasMany(models.TConfUser, {
        as: 'users',
        sourceKey: 'groupid',
        foreignKey: 'groupid'
      })
    }
  }
  TConfGroup.init({
    groupid: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    groupkode: DataTypes.STRING,
    groupnama: DataTypes.STRING,
    groupdefault: DataTypes.BOOLEAN,
    groupactive: DataTypes.STRING,
    grouphris: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'TConfGroup',
    tableName: 'tconfgroup',
    timestamps: false
  });
  return TConfGroup;
};
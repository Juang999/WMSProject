'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LocsTemporary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LocsTemporary.init({
    locst_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    locst_locs_id: {
      type: DataTypes.INTEGER,
      unique: true
    },
    locst_type: DataTypes.STRING,
    locst_type_oid: DataTypes.UUID,
    locst_user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    schema: 'public',
    modelName: 'LocsTemporary',
    tableName: 'locs_temporary',
    timestamps: false
  });
  return LocsTemporary;
};
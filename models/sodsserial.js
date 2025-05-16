'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SodsSerial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SodsSerial.init({
    sods_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    sods_sod_oid: DataTypes.UUID,
    sods_qty: DataTypes.INTEGER,
    sods_loc_id: DataTypes.INTEGER,
    sods_dt: DataTypes.DATE,
    sods_serial: DataTypes.STRING,
    sods_seq: DataTypes.INTEGER,
    sods_add_by: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'sods_serial',
    timestamps: false,
    modelName: 'SodsSerial',
  });
  return SodsSerial;
};
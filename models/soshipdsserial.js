'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SoShipdsSerial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SoShipdsSerial.belongsTo(models.LocMstr, {
        as: 'serial_location',
        targetKey: 'loc_id',
        foreignKey: 'soshipds_loc_id'
      })
    }
  }
  SoShipdsSerial.init({
    soshipds_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    soshipds_soshipd_oid: DataTypes.UUID,
    soshipds_seq: DataTypes.INTEGER,
    soshipds_qty: DataTypes.INTEGER,
    soshipds_qty_real: DataTypes.INTEGER,
    soshipds_si_id: DataTypes.INTEGER,
    soshipds_loc_id: DataTypes.INTEGER,
    soshipds_lot_serial: DataTypes.STRING,
    soshipds_dt: DataTypes.DATE,
    soshipds_qrbarcode: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'soshipds_serial',
    timestamps: false,
    modelName: 'SoShipdsSerial',
  });
  return SoShipdsSerial;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiudsSerial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      RiudsSerial.hasOne(models.InvcdDet, {
        as: 'data_serial',
        sourceKey: 'riuds_qrbarcode',
        foreignKey: 'invcd_qrbarcode'
      })
    }
  }
  RiudsSerial.init({
    riuds_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    riuds_riud_oid: DataTypes.UUID,
    riuds_invcd_oid: DataTypes.UUID,
    riuds_qty: DataTypes.INTEGER,
    riuds_si_id: DataTypes.INTEGER,
    riuds_loc_id: DataTypes.INTEGER,
    riuds_lot_serial: DataTypes.STRING,
    riuds_dt: DataTypes.DATE,
    riuds_um: DataTypes.INTEGER,
    riuds_qrbarcode: DataTypes.STRING,
    riuds_serial: DataTypes.INTEGER,
    riuds_pt_id: DataTypes.INTEGER,
    riuds_locs_id: DataTypes.INTEGER,
    riuds_invc_oid: DataTypes.UUID
  }, {
    sequelize,
    schema: 'public',
    tableName: 'riuds_serial',
    timestamps: false,
    modelName: 'RiudsSerial',
  });
  return RiudsSerial;
};
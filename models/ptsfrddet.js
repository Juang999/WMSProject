'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PtsfrdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PtsfrdDet.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'ptsfrd_pt_id'
      })

      PtsfrdDet.belongsTo(models.LocMstr, {
        as: 'location_destination',
        targetKey: 'loc_id',
        foreignKey: 'ptsfrd_loc_to_id'
      })

      PtsfrdDet.hasMany(models.PtsfrdsSerial, {
        as: 'serial',
        sourceKey: 'ptsfrd_oid',
        foreignKey: 'ptsfrds_ptsfrd_oid'
      })
    }
  }
  PtsfrdDet.init({
    ptsfrd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    ptsfrd_ptsfr_oid: DataTypes.UUID,
    ptsfrd_seq: DataTypes.INTEGER,
    ptsfrd_pt_id: DataTypes.INTEGER,
    ptsfrd_qty: DataTypes.INTEGER,
    ptsfrd_qty_receive: DataTypes.INTEGER,
    ptsfrd_um: DataTypes.INTEGER,
    ptsfrd_si_to_id: DataTypes.INTEGER,
    ptsfrd_loc_to_id: DataTypes.INTEGER,
    ptsfrd_lot_serial: DataTypes.INTEGER,
    ptsfrd_cost: DataTypes.INTEGER,
    ptsfrd_dt: DataTypes.DATE,
    ptsfrd_pbd_oid: DataTypes.UUID,
    ptsfrd_sqd_oid: DataTypes.UUID,
    ptsfrd_sod_oid: DataTypes.UUID,
    ptsfrd_pb_oid: DataTypes.UUID,
    ptsfrd_pb_code: DataTypes.STRING,
    ptsfrd_remarks: DataTypes.STRING,
    ptsfrd_invc_oid: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'ptsfrd_det',
    timestamps: false,
    modelName: 'PtsfrdDet',
  });
  return PtsfrdDet;
};
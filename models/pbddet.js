'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PbdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      PbdDet.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'pbd_pt_id'
      })

      PbdDet.hasOne(models.PbdsSerial, {
        as: 'singular_serial_inventory_request',
        sourceKey: 'pbd_oid',
        foreignKey: 'pbds_pbd_oid'
      })
    }
  }
  PbdDet.init({
    pbd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pbd_dom_id: DataTypes.INTEGER,
    pbd_en_id: DataTypes.INTEGER,
    pbd_add_by: DataTypes.STRING,
    pbd_add_date: DataTypes.DATE,
    pbd_upd_by: DataTypes.STRING,
    pbd_upd_date: DataTypes.DATE,
    pbd_pb_oid: DataTypes.UUID,
    pbd_seq: DataTypes.INTEGER,
    pbd_pt_id: DataTypes.INTEGER,
    pbd_rmks: DataTypes.STRING,
    pbd_end_user: DataTypes.STRING,
    pbd_qty: DataTypes.INTEGER,
    pbd_qty_processed: DataTypes.INTEGER,
    pbd_qty_completed: DataTypes.INTEGER,
    pbd_um: DataTypes.INTEGER,
    pbd_due_date: DataTypes.DATE,
    pbd_status: DataTypes.STRING,
    pbd_dt: DataTypes.DATE,
    pbd_si_id: DataTypes.INTEGER,
    pbd_qty_riud: DataTypes.INTEGER,
    pbd_pb2det_oid: DataTypes.UUID,
    pbd_pb2_code: DataTypes.STRING,
    pbd_pb2_oid: DataTypes.UUID
  }, {
    sequelize,
    schema: 'public',
    tableName: 'pbd_det',
    timestamps: false,
    modelName: 'PbdDet',
  });
  return PbdDet;
};
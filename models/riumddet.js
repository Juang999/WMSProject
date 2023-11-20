'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiumdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RiumdDet.belongsTo(models.RiumMstr, {
        as: 'header_inventory_receipt',
        targetKey: 'rium_oid',
        foreignKey: 'riumd_rium_oid'
      })

      RiumdDet.belongsTo(models.PtMstr, {
        as: 'detail_product',
        targetKey: 'pt_id',
        foreignKey: 'riumd_pt_id'
      })
    }
  }
  RiumdDet.init({
    riumd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    riumd_rium_oid: DataTypes.UUID,
    riumd_pt_id: DataTypes.INTEGER,
    riumd_qty: DataTypes.INTEGER,
    riumd_um: DataTypes.INTEGER,
    riumd_um_conv: DataTypes.INTEGER,
    riumd_qty_real: DataTypes.INTEGER,
    riumd_si_id: DataTypes.INTEGER,
    riumd_loc_id: DataTypes.INTEGER,
    riumd_lot_serial: DataTypes.STRING,
    riumd_cost: DataTypes.INTEGER,
    riumd_ac_id: DataTypes.INTEGER,
    riumd_sb_id: DataTypes.INTEGER,
    riumd_cc_id: DataTypes.INTEGER,
    riumd_dt: DataTypes.DATE,
    riumd_sod_oid: DataTypes.UUID,
    riumd_pbd_oid: DataTypes.UUID,
    riumd_cost_total: DataTypes.INTEGER,
    riumd_qty_shipment: DataTypes.INTEGER,
    riumd_locs_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'RiumdDet',
    tableName: 'riumd_det',
    timestamps: false
  });
  return RiumdDet;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiudDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RiudDet.belongsTo(models.RiuMstr, {
        as: 'header_receive_inventory',
        targetKey: 'riu_oid',
        foreignKey: 'riud_riu_oid'
      })

      RiudDet.belongsTo(models.PtMstr, {
        as: 'detail_product',
        targetKey: 'pt_id',
        foreignKey: 'riud_pt_id'
      })

      RiudDet.belongsTo(models.LocsMstr, {
        as: 'detail_data_sublocation',
        targetKey: 'locs_id',
        foreignKey: 'riud_locs_id'
      })

      RiudDet.belongsTo(models.AcMstr, {
        as: 'detail_data_account',
        targetKey: 'ac_id',
        foreignKey: 'riud_ac_id'
      })

      RiudDet.belongsTo(models.LocMstr, {
        as: 'detail_data_location',
        targetKey: 'loc_id',
        foreignKey: 'riud_loc_id'
      })
    }
  }
  RiudDet.init({
    riud_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    riud_riu_oid: DataTypes.UUID,
    riud_pt_id: DataTypes.INTEGER,
    riud_qty: DataTypes.INTEGER,
    riud_um: DataTypes.INTEGER,
    riud_um_conv: DataTypes.INTEGER,
    riud_qty_real: DataTypes.INTEGER,
    riud_si_id: DataTypes.INTEGER,
    riud_loc_id: DataTypes.INTEGER,
    riud_lot_serial: DataTypes.STRING,
    riud_cost: DataTypes.INTEGER,
    riud_ac_id: DataTypes.INTEGER,
    riud_sb_id: DataTypes.INTEGER,
    riud_cc_id: DataTypes.INTEGER,
    riud_dt: DataTypes.DATE,
    riud_sod_oid: DataTypes.UUID,
    riud_pbd_oid: DataTypes.UUID,
    riud_cost_total: DataTypes.INTEGER,
    riud_qty_shipment: DataTypes.INTEGER,
    riud_locs_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'riud_det',
    modelName: 'RiudDet',
    timestamps: false
  });
  return RiudDet;
};
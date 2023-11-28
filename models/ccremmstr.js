'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CcremMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CcremMstr.init({
    ccrem_date: DataTypes.DATE,
    ccrem_add_by: DataTypes.STRING,
    ccrem_add_date: DataTypes.DATE,
    ccrem_upd_by: DataTypes.STRING,
    ccrem_upd_date: DataTypes.DATE,
    ccrem_type: DataTypes.STRING,
    ccrem_pt_id: DataTypes.INTEGER,
    ccrem_si_id: DataTypes.INTEGER,
    ccrem_loc_id: DataTypes.INTEGER,
    ccrem_locs_id: DataTypes.INTEGER,
    ccrem_lot_serial: DataTypes.STRING,
    ccrem_qty: DataTypes.INTEGER,
    ccrem_um_id: DataTypes.INTEGER,
    ccrem_um_conv: DataTypes.INTEGER,
    ccrem_qty_real: DataTypes.INTEGER,
    ccrem_cost: DataTypes.INTEGER,
    ccrem_dt: DataTypes.DATE,
    ccrem_en_id: DataTypes.INTEGER,
    ccrem_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    ccrem_qty_old: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'ccrem_mstr',
    modelName: 'CcremMstr',
    timestamps: false
  });
  return CcremMstr;
};
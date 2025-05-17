'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvcdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InvcdDet.belongsTo(models.LocsMstr, {
        as: 'sublocation',
        targetKey: 'locs_id',
        foreignKey: 'invcd_locs_id'
      })

      InvcdDet.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'invcd_pt_id'
      })

      InvcdDet.belongsTo(models.LocMstr, {
        as: 'location',
        targetKey: 'loc_id',
        foreignKey: 'invcd_loc_id'
      })

      InvcdDet.belongsTo(models.TConfUser, {
        as: 'creator_operator',
        targetKey: 'usernama',
        foreignKey: 'invcd_add_by'
      })

      InvcdDet.belongsTo(models.TConfUser, {
        as: 'update_operator',
        targetKey: 'usernama',
        foreignKey: 'invcd_upd_by'
      })

      InvcdDet.hasOne(models.InvcdhHist, {
        as: 'singular_history',
        sourceKey: 'invcd_qrbarcode',
        foreignKey: 'invcdh_serial'
      })
    }
  }
  InvcdDet.init({
    invcd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    invcd_invc_oid: {
      type: DataTypes.UUID,
      allowNull: true
    },
    invcd_dom_id: DataTypes.INTEGER,
    invcd_en_id: DataTypes.INTEGER,
    invcd_pt_id: DataTypes.INTEGER,
    invcd_qty: DataTypes.INTEGER,
    invcd_lot_serial: DataTypes.STRING,
    invcd_qrbarcode: DataTypes.STRING,
    invcd_loc_id: DataTypes.INTEGER,
    invcd_locs_id: DataTypes.INTEGER,
    invcd_um: DataTypes.INTEGER,
    invcd_weight: DataTypes.INTEGER,
    invcd_trans_code: DataTypes.STRING,
    invcd_remarks: DataTypes.STRING,
    invcd_add_date: DataTypes.DATE,
    invcd_add_by: DataTypes.STRING,
    invcd_upd_date: DataTypes.DATE,
    invcd_upd_by: DataTypes.STRING,
    invcd_qty_old: DataTypes.INTEGER,
    invcd_si_id: DataTypes.INTEGER,
    invcd_date: DataTypes.DATEONLY,
    invcd_is_verified: DataTypes.STRING,
    invcd_is_booked: DataTypes.STRING,
    invcd_transaction_code: DataTypes.STRING,
    invcd_alias_qrbarcode: DataTypes.STRING,
    invcd_cs_oid: DataTypes.UUID,
    invcd_scanned_at: DataTypes.DATE,
    invcd_deleted_at: DataTypes.DATE,
    invcd_deleted_by: DataTypes.STRING,
    invcd_transaction_oid: DataTypes.UUID
  }, {
    sequelize,
    schema: 'public',
    modelName: 'InvcdDet',
    tableName: 'invcd_det',
    timestamps: false
  });
  return InvcdDet;
};
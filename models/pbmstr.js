'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PbMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      PbMstr.hasMany(models.PbdDet, {
        as: 'detail_inventory_request',
        sourceKey: 'pb_oid',
        foreignKey: 'pbd_pb_oid'
      })

      PbMstr.belongsTo(models.PbtType, {
        as: 'type_ir',
        targetKey: 'pbt_code',
        foreignKey: 'pb_pbt_code'
      })
    }
  }
  PbMstr.init({
    pb_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pb_dom_id: DataTypes.INTEGER,
    pb_en_id: DataTypes.INTEGER,
    pb_add_by: DataTypes.STRING,
    pb_add_date: DataTypes.DATE,
    pb_upd_by: DataTypes.STRING,
    pb_upd_date: DataTypes.DATE,
    pb_date: DataTypes.DATE,
    pb_due_date: DataTypes.DATE,
    pb_requested: DataTypes.STRING,
    pb_end_user: DataTypes.STRING,
    pb_rmks: DataTypes.STRING,
    pb_status: DataTypes.STRING,
    pb_close_date: DataTypes.DATE,
    pb_dt: DataTypes.DATE,
    pb_code: DataTypes.STRING,
    pb_trans_id: DataTypes.STRING,
    pb_tran_id: DataTypes.INTEGER,
    pb_pbt_code: DataTypes.STRING,
    pb_wo_oid: DataTypes.UUID,
    pb_is_unplan: DataTypes.STRING,
    pb_en_id_shipment: DataTypes.INTEGER,
    pb_reff_code: DataTypes.STRING,
    pb_status_inv_issue: DataTypes.STRING,
    pb_status_inv_receipt: DataTypes.STRING,
    pb_inv_issue_code: DataTypes.STRING,
    pb_status_reject_web: DataTypes.STRING,
    pb_inv_receipt_code: DataTypes.STRING,
    pb_status_packing: DataTypes.STRING,
    pb_packing_by: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'pb_mstr',
    timestamps: false,
    modelName: 'PbMstr',
  });
  return PbMstr;
};
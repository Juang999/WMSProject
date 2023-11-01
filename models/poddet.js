'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PodDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PodDet.belongsTo(models.PoMstr, {
        as: 'header_purchase_order',
        targetKey: 'po_oid',
        foreignKey: 'pod_po_oid'
      })

      PodDet.belongsTo(models.PtMstr, {
        as: 'detail_product',
        targetKey: 'pt_id',
        foreignKey: 'pod_pt_id'
      })
    }
  }
  PodDet.init({
    pod_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pod_dom_id: DataTypes.INTEGER,
    pod_en_id: DataTypes.INTEGER,
    pod_add_by: DataTypes.STRING,
    pod_add_date: DataTypes.DATE,
    pod_upd_by: DataTypes.STRING,
    pod_upd_date: DataTypes.DATE,
    pod_po_oid: DataTypes.UUID,
    pod_seq: DataTypes.INTEGER,
    pod_reqd_oid: DataTypes.UUID,
    pod_si_id: DataTypes.INTEGER,
    pod_pt_id: DataTypes.INTEGER,
    pod_rmks: DataTypes.STRING,
    pod_end_user: DataTypes.STRING,
    pod_qty: DataTypes.INTEGER,
    pod_qty_receive: DataTypes.INTEGER,
    pod_qty_invoice: DataTypes.INTEGER,
    pod_um: DataTypes.INTEGER,
    pod_cost: DataTypes.INTEGER,
    pod_disc: DataTypes.INTEGER,
    pod_sb_id: DataTypes.INTEGER,
    pod_cc_id: DataTypes.INTEGER,
    pod_pjc_id: DataTypes.INTEGER,
    pod_need_date: DataTypes.DATE,
    pod_due_date: DataTypes.DATE,
    pod_um_conv: DataTypes.INTEGER,
    pod_qty_real: DataTypes.INTEGER,
    pod_pt_class: DataTypes.STRING,
    pod_taxable: DataTypes.STRING,
    pod_tax_inc: DataTypes.STRING,
    pod_tax_class: DataTypes.INTEGER,
    pod_status: DataTypes.STRING,
    pod_dt: DataTypes.DATE,
    pod_qty_return: DataTypes.INTEGER,
    pod_memo: DataTypes.STRING,
    pod_pt_desc1: DataTypes.STRING,
    pod_pt_desc2: DataTypes.STRING,
    pod_qty_so: DataTypes.INTEGER,
    pod_loc_id: DataTypes.INTEGER,
    pod_height: DataTypes.INTEGER,
    pod_width: DataTypes.INTEGER,
    pod_cost_film: DataTypes.INTEGER,
    pod_ppn: DataTypes.INTEGER,
    pod_pph: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PodDet',
    tableName: 'pod_det',
    timestamps: false
  });
  return PodDet;
};
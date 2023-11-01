'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PoMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PoMstr.hasMany(models.PodDet, {
        as: 'detail_purchase_order',
        sourceKey: 'po_oid',
        foreignKey: 'pod_po_oid'
      })

      PoMstr.belongsTo(models.PtnrMstr, {
        as: 'detail_customer',
        targetKey: 'ptnr_id',
        foreignKey: 'po_ptnr_id'
      })
    }
  }
  PoMstr.init({
    po_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    po_dom_id: DataTypes.INTEGER,
    po_en_id: DataTypes.INTEGER,
    po_upd_date: DataTypes.DATE,
    po_upd_by: DataTypes.STRING,
    po_add_date: DataTypes.DATE,
    po_add_by: DataTypes.STRING,
    po_code: DataTypes.STRING,
    po_ptnr_id: DataTypes.INTEGER,
    po_cmaddr_id: DataTypes.INTEGER,
    po_date: DataTypes.DATE,
    po_need_date: DataTypes.DATE,
    po_due_date: DataTypes.DATE,
    po_rmks: DataTypes.STRING,
    po_sb_id: DataTypes.INTEGER,
    po_cc_id: DataTypes.INTEGER,
    po_si_id: DataTypes.INTEGER,
    po_pjc_id: DataTypes.INTEGER,
    po_close_date: DataTypes.DATE,
    po_total: DataTypes.INTEGER,
    po_tran_id: DataTypes.INTEGER,
    po_trans_id: DataTypes.STRING,
    po_credit_term: DataTypes.INTEGER,
    po_taxable: DataTypes.STRING,
    po_tax_inc: DataTypes.STRING,
    po_tax_class: DataTypes.INTEGER,
    po_cu_id: DataTypes.INTEGER,
    po_exc_rate: DataTypes.INTEGER,
    po_trans_rmks: DataTypes.STRING,
    po_current_route: DataTypes.STRING,
    po_next_route: DataTypes.STRING,
    po_dt: DataTypes.DATE,
    po_total_ppn: DataTypes.INTEGER,
    po_freight: DataTypes.INTEGER,
    po_total_pph: DataTypes.INTEGER,
    po_status_cash: DataTypes.STRING,
    po_bk_id: DataTypes.INTEGER,
    po_film: DataTypes.STRING,
    po_auto_receipt: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PoMstr',
    tableName: 'po_mstr',
    timestamps: false
  });
  return PoMstr;
};
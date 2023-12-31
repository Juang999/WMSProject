'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PtMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PtMstr.hasMany(models.SodDet, {
        as: 'detail_order',
        sourceKey: 'pt_id',
        foreignKey: 'sod_pt_id'
      })

      PtMstr.hasMany(models.InvctTable, {
        as: 'cost_product',
        sourceKey: 'pt_id',
        foreignKey: 'invct_pt_id'
      })

      PtMstr.hasMany(models.PodDet, {
        as: 'purchase_order',
        sourceKey: 'pt_id',
        foreignKey: 'pod_pt_id'
      })

      PtMstr.hasMany(models.RiumdDet, {
        as: 'inventory_receipt',
        sourceKey: 'pt_id',
        foreignKey: 'riumd_pt_id'
      })
    }
  }
  PtMstr.init({
    pt_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pt_dom_id: DataTypes.INTEGER,
    pt_en_id: DataTypes.INTEGER,
    pt_add_by: DataTypes.STRING,
    pt_add_date: DataTypes.DATE,
    pt_upd_by: DataTypes.STRING,
    pt_upd_date: DataTypes.DATE,
    pt_id: DataTypes.INTEGER,
    pt_code: DataTypes.STRING,
    pt_desc1: DataTypes.STRING,
    pt_desc2: DataTypes.STRING,
    pt_pl_id: DataTypes.INTEGER,
    pt_um: DataTypes.INTEGER,
    pt_its_id: DataTypes.INTEGER,
    pt_type: DataTypes.STRING,
    pt_cost_method: DataTypes.STRING,
    pt_loc_type: DataTypes.INTEGER,
    pt_po_is: DataTypes.INTEGER,
    pt_group: DataTypes.INTEGER,
    pt_taxable: DataTypes.STRING,
    pt_pm_code: DataTypes.STRING,
    pt_ls: DataTypes.STRING,
    pt_sfty_stk: DataTypes.INTEGER,
    pt_rop: DataTypes.INTEGER,
    pt_ord_min: DataTypes.INTEGER,
    pt_ord_max: DataTypes.INTEGER,
    pt_cost: DataTypes.INTEGER,
    pt_price: DataTypes.INTEGER,
    pt_dt: DataTypes.DATE,
    pt_loc_id: DataTypes.INTEGER,
    pt_syslog_code: DataTypes.STRING,
    pt_class: DataTypes.STRING,
    pt_writer_id: DataTypes.INTEGER,
    pt_eng_id: DataTypes.INTEGER,
    pt_ppn_type: DataTypes.STRING,
    pt_tax_class: DataTypes.INTEGER,
    pt_si_id: DataTypes.INTEGER,
    pt_tax_inc: DataTypes.STRING,
    pt_approval_status: DataTypes.STRING,
    pt_isbn: DataTypes.STRING,
    pt_phantom: DataTypes.STRING,
    pt_ro_id: DataTypes.INTEGER,
    pt_gambar: DataTypes.STRING,
    pt_qty: DataTypes.INTEGER,
    pt_additional: DataTypes.STRING,
    pt_year: DataTypes.DATE,
    pt_size_code_id: DataTypes.INTEGER,
    pt_psplan_id: DataTypes.INTEGER,
    pt_cat_id: DataTypes.INTEGER,
    pt_scat_id: DataTypes.INTEGER,
    pt_color_tag: DataTypes.STRING,
    pt_clothes_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'PtMstr',
    tableName: 'pt_mstr',
    timestamps: false    
  });
  return PtMstr;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PcklsMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PcklsMstr.hasMany(models.PcklsdDet, {
        as: 'detail_picking_list',
        sourceKey: 'pckls_oid',
        foreignKey: 'pcklsd_pckls_oid'
      })
    }
  }
  PcklsMstr.init({
    pckls_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pckls_dom_id: DataTypes.INTEGER,
    pckls_en_id: DataTypes.INTEGER,
    pckls_add_by: DataTypes.STRING,
    pckls_add_date: DataTypes.DATE,
    pckls_upd_by: DataTypes.STRING,
    pckls_upd_date: DataTypes.DATE,
    pckls_code: DataTypes.STRING,
    pckls_sold_to: DataTypes.INTEGER,
    pckls_date: DataTypes.DATE,
    pckls_eff_date: DataTypes.DATE,
    pckls_expt_date: DataTypes.DATE,
    pckls_remarks: DataTypes.STRING,
    pckls_status: DataTypes.STRING,
    pckls_dt: DataTypes.DATE,
    pckls_shipping_charges: DataTypes.INTEGER,
    pckls_total_final: DataTypes.INTEGER,
    pckls_arp_code: DataTypes.UUID,
    pckls_arp_oid: DataTypes.UUID,
    pckls_shipment: DataTypes.STRING,
    pckls_shipment_date: DataTypes.DATE,
    pckls_bill_to: DataTypes.INTEGER,
    pckls_due_date: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    tableName: 'pckls_mstr',
    modelName: 'PcklsMstr',
    timestamps: false
  });
  return PcklsMstr;
};
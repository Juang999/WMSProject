'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PcklsdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PcklsdDet.belongsTo(models.PcklsMstr, {
        as: 'header_picking_list',
        targetKey: 'pckls_oid',
        foreignKey: 'pcklsd_pckls_oid'
      })

      PcklsdDet.belongsTo(models.SodDet, {
        as: 'detail_data_sales_order',
        targetKey: 'sod_oid',
        foreignKey: 'pcklsd_sod_oid'
      })
    }
  }
  PcklsdDet.init({
    pcklsd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pcklsd_pckls_oid: DataTypes.UUID,
    pcklsd_sod_oid: DataTypes.UUID,
    pcklsd_dt: DataTypes.DATE,
    pcklsd_seq: DataTypes.INTEGER,
    pcklsd_sod_qty: DataTypes.INTEGER,
    pcklsd_packing: DataTypes.INTEGER,
    pcklsd_collie_number: DataTypes.INTEGER,
    pcklsd_so_code: DataTypes.STRING,
    pcklsd_pt_id: DataTypes.INTEGER,
    pcklsd_open: DataTypes.INTEGER,
    pcklsd_close_line: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'pcklsd_det',
    modelName: 'PcklsdDet',
    timestamps: false
  });
  return PcklsdDet;
};
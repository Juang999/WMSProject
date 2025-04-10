'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SoShipMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SoShipMstr.hasMany(models.SoShipdDet, {
        as: 'detail_soship',
        sourceKey: 'soship_oid',
        foreignKey: 'soshipd_soship_oid'
      })

      SoShipMstr.belongsTo(models.SoMstr, {
        as: 'sales_order_master',
        targetKey: 'so_oid',
        foreignKey: 'soship_so_oid'
      })
    }
  }
  SoShipMstr.init({
    soship_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    soship_dom_id: DataTypes.INTEGER,
    soship_en_id: DataTypes.INTEGER,
    soship_add_by: DataTypes.STRING,
    soship_add_date: DataTypes.DATE,
    soship_upd_by: DataTypes.STRING,
    soship_upd_date: DataTypes.DATE,
    soship_code: DataTypes.STRING,
    soship_date: DataTypes.DATE,
    soship_so_oid: DataTypes.UUID,
    soship_si_id: DataTypes.INTEGER,
    soship_is_shipment: DataTypes.STRING,
    soship_dt: DataTypes.DATE,
    soship_exc_rate: DataTypes.INTEGER,
    soship_cu_id: DataTypes.INTEGER,
    soship_ti_in_use: DataTypes.STRING,
    soship_remarks: DataTypes.STRING,
    soship_print_dt: DataTypes.DATE,
    soship_print: DataTypes.STRING,
    soship_booking: DataTypes.STRING,
    soship_cons: DataTypes.STRING,
    soship_alocated: DataTypes.STRING,
    soship_pcs_oid: DataTypes.UUID,
    soship_pcs_code: DataTypes.STRING,
    soship_accepted: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'soship_mstr',
    timestamps: false,
    modelName: 'SoShipMstr',
  });
  return SoShipMstr;
};
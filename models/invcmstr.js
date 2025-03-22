'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvcMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InvcMstr.belongsTo(models.LocMstr, {
        as: 'location',
        targetKey: 'loc_id',
        foreignKey: 'invc_loc_id'
      })
    }
  }
  InvcMstr.init({
    invc_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    invc_dom_id: DataTypes.INTEGER,
    invc_en_id: DataTypes.INTEGER,
    invc_si_id: DataTypes.INTEGER,
    invc_loc_id: DataTypes.INTEGER,
    invc_pt_id: DataTypes.INTEGER,
    invc_qty_available: DataTypes.INTEGER,
    invc_qty_booked: DataTypes.INTEGER,
    invc_qty: DataTypes.INTEGER,
    invc_qty_old: DataTypes.INTEGER,
    invc_serial: DataTypes.STRING,
    pt_tax_class: DataTypes.STRING,
    invc_qty_alloc: DataTypes.INTEGER,
    invc_sq_booking: DataTypes.STRING,
    invc_last_booked: DataTypes.DATE,
    invc_total: DataTypes.INTEGER,
    invc_qty_booking: DataTypes.INTEGER,
    invc_shwn_id: DataTypes.INTEGER,
    invc_pjc_id: DataTypes.INTEGER,
    invc_is_verified: DataTypes.STRING,
    invc_is_locked: DataTypes.BOOLEAN
  }, {
    sequelize,
    schema: 'public',
    tableName: 'invc_mstr',
    timestamps: false,
    modelName: 'InvcMstr',
  });
  return InvcMstr;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScanOutdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ScanOutdDet.belongsTo(models.PtMstr, {
        as: 'product',
        foreignKey: 'scd_pt_id',
        targetKey: 'pt_id',
      })
    }
  }
  ScanOutdDet.init({
    scd_oid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    scd_en_id: DataTypes.INTEGER,
    scd_sc_oid: DataTypes.UUID,
    scd_pt_id: DataTypes.INTEGER,
    scd_qty: DataTypes.INTEGER,
    scd_created_by: DataTypes.STRING,
    scd_created_at: DataTypes.DATE,
    scd_loc_id: DataTypes.INTEGER,
    scd_locs_id: DataTypes.INTEGER,
    scd_serial: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'scanoutd_det',
    timestamps: false,
    schema: 'public',
    modelName: 'ScanOutdDet',
  });
  return ScanOutdDet;
};
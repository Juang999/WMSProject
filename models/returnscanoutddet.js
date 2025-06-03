'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReturnScanOutdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReturnScanOutdDet.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'rscd_pt_id'
      })
    }
  }
  ReturnScanOutdDet.init({
    rscd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    rscd_rsc_oid: DataTypes.UUID,
    rscd_pt_id: DataTypes.INTEGER,
    rscd_qrbarcode: DataTypes.STRING,
    rscd_created_by: DataTypes.STRING,
    rscd_created_at: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    tableName: 'returnscanoutd_det',
    timestamps: false,
    modelName: 'ReturnScanOutdDet',
  });
  return ReturnScanOutdDet;
};
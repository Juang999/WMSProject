'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReturnScanOutMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReturnScanOutMstr.belongsTo(models.ScanOutMstr, {
        as: 'header_scanout',
        targetKey: 'sc_oid',
        foreignKey: 'rsc_sc_oid'
      })
    }
  }
  ReturnScanOutMstr.init({
    rsc_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    rsc_created_by: DataTypes.STRING,
    rsc_created_at: DataTypes.DATE,
    rsc_sc_oid: DataTypes.UUID,
    rsc_sc_code: DataTypes.STRING,
    rsc_status_id: DataTypes.STRING,
    rsc_code: DataTypes.STRING,
    rsc_en_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'returnscanout_mstr',
    timestamps: false,
    modelName: 'ReturnScanOutMstr',
  });
  return ReturnScanOutMstr;
};
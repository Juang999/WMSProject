'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SomddDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SomddDet.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'somdd_pt_id'
      })
    }
  }
  SomddDet.init({
    somdd_oid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    somdd_somd_oid: DataTypes.UUID,
    somdd_seq: DataTypes.INTEGER,
    somdd_pt_id: DataTypes.INTEGER,
    somdd_loc_id: DataTypes.INTEGER,
    somdd_serial: DataTypes.INTEGER,
    somdd_qty_sys: DataTypes.INTEGER,
    somdd_qty_real: DataTypes.INTEGER,
    somdd_created_by: DataTypes.STRING,
    somdd_created_date: DataTypes.DATE,
    somdd_updated_by: DataTypes.STRING,
    somdd_updated_date: DataTypes.DATE
  }, {
    sequelize,
    timestamps: false,
    schema: 'public',
    tableName: 'somdd_det',
    modelName: 'SomddDet',
  });
  return SomddDet;
};
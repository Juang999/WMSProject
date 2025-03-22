'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SomdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SomdDet.belongsTo(models.InvcMstr, {
        as: 'data_inventory',
        targetKey: 'invc_oid',
        foreignKey: 'somd_invc_oid'
      })

      SomdDet.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'somd_pt_id'
      })
    }
  }
  SomdDet.init({
    somd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    somd_id: DataTypes.INTEGER,
    somd_som_oid: DataTypes.UUID,
    somd_seq: DataTypes.INTEGER,
    somd_invc_oid: DataTypes.UUID,
    somd_pt_id: DataTypes.INTEGER,
    somd_loc_id: DataTypes.INTEGER,
    somd_serial_lot: DataTypes.STRING,
    somd_qty_sys: DataTypes.INTEGER,
    somd_qty_real: DataTypes.INTEGER,
    somd_created_by: DataTypes.STRING,
    somd_created_date: DataTypes.DATE,
    somd_updated_by: DataTypes.STRING,
    somd_updated_date: DataTypes.DATE,
    somd_variance: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    schema: 'public',
    tableName: 'somd_det',
    modelName: 'SomdDet',
  });
  return SomdDet;
};
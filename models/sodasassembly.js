'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SodasAssembly extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SodasAssembly.belongsTo(models.PtMstr, {
        as: 'product_parent_relation',
        targetKey: 'pt_id',
        foreignKey: 'sodas_pt_id_sod'
      });

      SodasAssembly.belongsTo(models.PtMstr, {
        as: 'product_children_relation',
        targetKey: 'pt_id',
        foreignKey: 'sodas_pt_id'
      })
    }
  }
  SodasAssembly.init({
    sodas_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    sodas_so_oid: DataTypes.UUID,
    sodas_pt_id_sod: DataTypes.INTEGER,
    sodas_pt_id: DataTypes.INTEGER,
    sodas_qty: DataTypes.DECIMAL,
    sodas_sod_oid: DataTypes.UUID,
    sodas_qty_sold: DataTypes.UUID
  }, {
    sequelize,
    schema: 'public',
    tableName: 'sodas_assembly',
    timestamps: false,
    modelName: 'SodasAssembly',
  });
  return SodasAssembly;
};
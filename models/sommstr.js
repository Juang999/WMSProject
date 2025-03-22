'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SomMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SomMstr.belongsTo(models.TConfUser, {
        as: 'user_pic',
        targetKey: 'userid',
        foreignKey: 'som_user_id'
      })

      SomMstr.belongsTo(models.LocMstr, {
        as: 'location',
        targetKey: 'loc_id',
        foreignKey: 'som_loc_id',
      })

      SomMstr.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'som_pt_id'
      })

      SomMstr.hasMany(models.SomdDet, {
        as: 'detail_opname',
        sourceKey: 'som_oid',
        foreignKey: 'somd_som_oid',
      })
    }
  }
  SomMstr.init({
    som_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    som_id: DataTypes.INTEGER,
    som_en_id: DataTypes.INTEGER,
    som_date: DataTypes.DATE,
    som_code: DataTypes.STRING,
    som_loc_id: DataTypes.INTEGER,
    som_group_code: DataTypes.INTEGER,
    som_pt_type_id: DataTypes.INTEGER,
    som_pt_id: DataTypes.INTEGER,
    som_user_id: DataTypes.INTEGER,
    som_remarks: DataTypes.STRING,
    som_status: DataTypes.STRING,
    som_locked: DataTypes.BOOLEAN,
    som_qty_ttl: DataTypes.INTEGER,
    som_created_by: DataTypes.STRING,
    som_created_date: DataTypes.DATE,
    som_released_by: DataTypes.STRING,
    som_released_date: DataTypes.DATE,
    som_closed_by: DataTypes.STRING,
    som_closed_date: DataTypes.DATE,
    som_year: DataTypes.INTEGER,
    som_start_date: DataTypes.DATE,
    som_end_date: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    tableName: 'som_mstr',
    timestamps: false,
    modelName: 'SomMstr',
  });
  return SomMstr;
};
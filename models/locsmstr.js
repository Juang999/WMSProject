'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LocsMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LocsMstr.belongsTo(models.LocMstr, {
        as: 'location',
        targetKey: 'loc_id',
        foreignKey: 'locs_loc_id'
      })

      LocsMstr.hasMany(models.InvcdDet, {
        as: 'data_product',
        sourceKey: 'losc_id',
        foreignKey: 'invcd_locs_id'
      })
    }
  }
  LocsMstr.init({
    locs_en_id: DataTypes.INTEGER,
    losc_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    locs_loc_id: DataTypes.INTEGER,
    locs_add_date: DataTypes.DATE,
    locs_add_by: DataTypes.STRING,
    locs_upd_date: DataTypes.DATE,
    locs_upd_by: DataTypes.STRING,
    locs_name: DataTypes.STRING,
    locs_remarks: DataTypes.STRING,
    locs_active: DataTypes.STRING,
    locs_cap: DataTypes.INTEGER,
    locs_subcat_id: DataTypes.INTEGER,
    locs_type: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'LocsMstr',
    tableName: 'locs_mstr',
    timestamps: false
  });
  return LocsMstr;
};
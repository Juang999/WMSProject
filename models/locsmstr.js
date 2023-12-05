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
        sourceKey: 'locs_id',
        foreignKey: 'invcd_locs_id'
      })

      LocsMstr.hasMany(models.LocsTemporary, {
        as: 'data_temporary',
        sourceKey: 'locs_id',
        foreignKey: 'locst_locs_id'
      })

      LocsMstr.hasMany(models.RiudDet, {
        as: 'detail_data_inventory_receipt',
        sourceKey: 'locs_id',
        foreignKey: 'riud_locs_id'
      })
    }
  }
  LocsMstr.init({
    locs_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    locs_en_id: DataTypes.INTEGER,
    locs_id: {
      type: DataTypes.INTEGER,
      unique: true
    },
    locs_loc_id: DataTypes.INTEGER,
    locs_add_date: DataTypes.DATE,
    locs_add_by: DataTypes.STRING,
    locs_upd_date: DataTypes.DATE,
    locs_upd_by: DataTypes.STRING,
    locs_name: DataTypes.STRING,
    locs_floor_id: DataTypes.INTEGER,
    locs_block_code: DataTypes.STRING,
    locs_rack_no: DataTypes.INTEGER,
    locs_row_no: DataTypes.INTEGER,
    locs_column_no: DataTypes.INTEGER,
    locs_shelf_id: DataTypes.INTEGER,
    locs_subcat_id: DataTypes.INTEGER,
    locs_cap: DataTypes.INTEGER,
    locs_remarks: DataTypes.STRING,
    locs_active: DataTypes.STRING,
    locs_admit_inv: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    modelName: 'LocsMstr',
    tableName: 'locs_mstr',
    timestamps: false
  });
  return LocsMstr;
};
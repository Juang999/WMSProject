'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MvSublocHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MvSublocHistory.init({
    mvsubloc_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    mvsubloc_add_by: DataTypes.STRING,
    mvsubloc_add_date: DataTypes.DATE,
    mvsubloc_upd_by: DataTypes.STRING,
    mvsubloc_upd_date: DataTypes.DATE,
    mvsubloc_summary: DataTypes.STRING,
    mvsubloc_desc: DataTypes.STRING,
    mvsubloc_use_git: DataTypes.STRING,
    mvsubloc_pt_id: DataTypes.INTEGER,
    mvsubloc_qty: DataTypes.INTEGER,
    mvsubloc_locs_from: DataTypes.INTEGER,
    mvsubloc_locs_git: DataTypes.INTEGER,
    mvsubloc_locs_to: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'mvsubloc_history',
    modelName: 'MvSublocHistory',
    timestamps: false
  });
  return MvSublocHistory;
};
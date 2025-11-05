'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SbMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SbMstr.init({
    sb_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    sb_dom_id: DataTypes.INTEGER,
    sb_en_id: DataTypes.INTEGER,
    sb_add_by: DataTypes.STRING,
    sb_add_date: DataTypes.DATE,
    sb_upd_by: DataTypes.STRING,
    sb_upd_date: DataTypes.DATE,
    sb_id: DataTypes.INTEGER,
    sb_code: DataTypes.STRING,
    sb_desc: DataTypes.STRING,
    sb_active: DataTypes.STRING,
    sb_dt: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    tableName: 'sb_mstr',
    timestamps: false,
    modelName: 'SbMstr',
  });
  return SbMstr;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BkMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BkMstr.init({
    bk_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    bk_dom_id: DataTypes.INTEGER,
    bk_en_id: DataTypes.INTEGER,
    bk_add_by: DataTypes.STRING,
    bk_add_date: DataTypes.DATE,
    bk_upd_by: DataTypes.STRING,
    bk_upd_date: DataTypes.DATE,
    bk_id: DataTypes.INTEGER,
    bk_code: DataTypes.STRING,
    bk_name: DataTypes.STRING,
    bk_cu_id: DataTypes.INTEGER,
    bk_ac_id: DataTypes.INTEGER,
    bk_cc_id: DataTypes.INTEGER,
    bk_sb_id: DataTypes.INTEGER,
    bk_active: DataTypes.STRING,
    bk_dt: DataTypes.DATE,
    bk_account: DataTypes.STRING,
    bk_an: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'bk_mstr',
    timestamps: false,
    modelName: 'BkMstr',
  });
  return BkMstr;
};
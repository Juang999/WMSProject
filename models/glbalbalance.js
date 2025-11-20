'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GlBalBalance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GlBalBalance.init({
    glbal_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    glbal_dom_id: DataTypes.INTEGER,
    glbal_en_id: DataTypes.INTEGER,
    glbal_add_by: DataTypes.STRING,
    glbal_add_date: DataTypes.DATE,
    glbal_upd_by: DataTypes.STRING,
    glbal_upd_date: DataTypes.DATE,
    glbal_gcal_oid: DataTypes.UUID,
    glbal_ac_id: DataTypes.INTEGER,
    glbal_sb_id: DataTypes.INTEGER,
    glbal_cc_id: DataTypes.INTEGER,
    glbal_cu_id: DataTypes.INTEGER,
    glbal_balance_open: DataTypes.INTEGER,
    glbal_balance_unposted: DataTypes.INTEGER,
    glbal_balance_posted: DataTypes.INTEGER,
    glbal_dt: DataTypes.DATE,
    glbal_balance_posted_end_month: DataTypes.INTEGER,
    glbal_balance_trial: DataTypes.INTEGER,
    glbal_balance_end_month1: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'glbal_balance',
    timestamps: false,
    modelName: 'GlBalBalance',
  });
  return GlBalBalance;
};
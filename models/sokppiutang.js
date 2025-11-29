'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SokpPiutang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SokpPiutang.init({
    sokp_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    sokp_so_oid: DataTypes.UUID,
    sokp_seq: DataTypes.INTEGER,
    sokp_amount: DataTypes.DECIMAL,
    sokp_amount_pay: DataTypes.DECIMAL,
    sokp_description: DataTypes.STRING,
    sokp_due_date: DataTypes.DATEONLY,
    sokp_status: DataTypes.STRING,
    sokp_ar_oid: DataTypes.UUID,
    sokp_ref: DataTypes.STRING,
    sokp_date_payment: DataTypes.DATEONLY,
    sokp_add_by: DataTypes.STRING,
    sokp_upd_by: DataTypes.STRING,
    sokp_add_date: DataTypes.DATE,
    sokp_upd_date: DataTypes.DATE,
    sokp_sq_oid: DataTypes.UUID
  }, {
    sequelize,
    schema: 'public',
    tableName: 'sokp_piutang',
    timestamps: false,
    modelName: 'SokpPiutang',
  });
  return SokpPiutang;
};
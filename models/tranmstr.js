'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TranMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TranMstr.init({
    tran_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    tran_id: DataTypes.INTEGER,
    tran_table: DataTypes.STRING,
    tran_name: DataTypes.STRING,
    tran_desc: DataTypes.STRING,
    tran_review_amount: DataTypes.STRING,
    tran_dt: DataTypes.DATE,
    tran_active: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'tran_mstr',
    timestamps: false,
    modelName: 'TranMstr',
  });
  return TranMstr;
};
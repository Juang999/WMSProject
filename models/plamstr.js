'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlaMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlaMstr.belongsTo(models.AcMstr, {
        as: 'account_relation',
        targetKey: 'ac_id',
        foreignKey: 'pla_ac_id'
      });

      PlaMstr.belongsTo(models.PlMstr, {
        as: 'productline_relation',
        targetKey: 'pl_id',
        foreignKey: 'pla_pl_id'
      });
    }
  }
  PlaMstr.init({
    pla_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pla_seq: DataTypes.INTEGER,
    pla_param: DataTypes.STRING,
    pla_code: DataTypes.STRING,
    pla_desc: DataTypes.STRING,
    pla_ac_id: DataTypes.INTEGER,
    pla_sb_id: DataTypes.INTEGER,
    pla_cc_id: DataTypes.INTEGER,
    pla_dt: DataTypes.DATE,
    pla_pl_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'pla_mstr',
    timestamps: false,
    modelName: 'PlaMstr',
  });
  return PlaMstr;
};
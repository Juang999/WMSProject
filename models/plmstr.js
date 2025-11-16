'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PlMstr.init({
    pl_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pl_dom_id: DataTypes.INTEGER,
    pl_add_by: DataTypes.STRING,
    pl_add_date: DataTypes.DATE,
    pl_upd_by: DataTypes.STRING,
    pl_upd_date: DataTypes.DATE,
    pl_id: DataTypes.INTEGER,
    pl_code: DataTypes.STRING,
    pl_desc: DataTypes.STRING,
    pl_taxable: DataTypes.STRING,
    pl_tax_class: DataTypes.INTEGER,
    pl_active: DataTypes.STRING,
    pl_dt: DataTypes.DATE,
    pl_fa_depr: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'pl_mstr',
    timestamps: false,
    modelName: 'PlMstr',
  });
  return PlMstr;
};
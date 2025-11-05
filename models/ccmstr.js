'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CcMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CcMstr.init({
    cc_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    cc_dom_id: DataTypes.INTEGER,
    cc_en_id: DataTypes.INTEGER,
    cc_add_by: DataTypes.STRING,
    cc_add_date: DataTypes.DATE,
    cc_upd_by: DataTypes.STRING,
    cc_upd_date: DataTypes.DATE,
    cc_id: DataTypes.INTEGER,
    cc_code: DataTypes.STRING,
    cc_desc: DataTypes.STRING,
    cc_active: DataTypes.STRING,
    cc_dt: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    tableName: 'cc_mstr',
    timestamps: false,
    modelName: 'CcMstr',
  });
  return CcMstr;
};
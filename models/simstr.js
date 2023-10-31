'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SiMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SiMstr.init({
    si_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    si_dom_id: DataTypes.INTEGER,
    si_en_id: DataTypes.INTEGER,
    si_add_by: DataTypes.STRING,
    si_add_date: DataTypes.DATE,
    si_upd_by: DataTypes.STRING,
    si_upd_date: DataTypes.DATE,
    si_id: DataTypes.INTEGER,
    si_code: DataTypes.STRING,
    si_desc: DataTypes.STRING,
    si_active: DataTypes.STRING,
    si_dt: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    modelName: 'SiMstr',
    tableName: 'si_mstr',
    timestamps: false
  });
  return SiMstr;
};
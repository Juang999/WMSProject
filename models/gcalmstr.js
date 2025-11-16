'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GCalMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GCalMstr.init({
    gcal_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    gcal_dom_id: DataTypes.INTEGER,
    gcal_add_by: DataTypes.STRING,
    gcal_add_date: DataTypes.DATE,
    gcal_upd_by: DataTypes.STRING,
    gcal_upd_date: DataTypes.DATE,
    gcal_year: DataTypes.INTEGER,
    gcal_periode: DataTypes.INTEGER,
    gcal_start_date: DataTypes.DATEONLY,
    gcal_end_date: DataTypes.DATEONLY,
    gcal_dt: DataTypes.DATE,
    gcal_pra_closing: DataTypes.STRING,
    gcal_closing: DataTypes.STRING,
    gcal_generate_status: DataTypes.STRING,
    gcal_gen_01: DataTypes.STRING,
    gcal_gen_02: DataTypes.STRING,
    gcal_gen_03: DataTypes.STRING,
    gcal_gen_04: DataTypes.STRING,
    gcal_gen_05: DataTypes.STRING,
    gcal_gen_06: DataTypes.STRING,
    gcal_gen_07: DataTypes.STRING,
    gcal_gen_08: DataTypes.STRING,
    gcal_gen_09: DataTypes.STRING,
    gcal_gen_10: DataTypes.STRING,
    gcal_gen_11: DataTypes.STRING,
    gcal_gen_12: DataTypes.STRING,
    gcal_gen_13: DataTypes.STRING,
    gcal_gen_14: DataTypes.STRING,
    gcal_gen_15: DataTypes.STRING,
    gcal_gen_16: DataTypes.STRING,
    gcal_gen_17: DataTypes.STRING,
    gcal_gen_18: DataTypes.STRING,
    gcal_gen_19: DataTypes.STRING,
    gcal_gen_20: DataTypes.STRING,
    gcal_gen_21: DataTypes.STRING,
    gcal_gen_22: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'gcal_mstr',
    timestamps: false,
    modelName: 'GCalMstr',
  });
  return GCalMstr;
};
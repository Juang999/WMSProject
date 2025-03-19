'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvcdhMstr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InvcdhMstr.init({
    invcdh_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    invcdh_tran_id: DataTypes.INTEGER,
    invcdh_seq: DataTypes.INTEGER,
    invcdh_dom_id: DataTypes.INTEGER,
    invcdh_en_id: DataTypes.INTEGER,
    invcdh_trn_code: DataTypes.STRING,
    invcdh_date: DataTypes.DATE,
    invcdh_desc: DataTypes.STRING,
    invcdh_opn_type: DataTypes.STRING,
    invcdh_si_id: DataTypes.INTEGER,
    invcdh_loc_id: DataTypes.INTEGER,
    invcdh_locs_id: DataTypes.INTEGER,
    invcdh_qty_new: DataTypes.INTEGER,
    invcdh_qty_old: DataTypes.INTEGER,
    invcdh_add_by: DataTypes.STRING,
    invcdh_add_date: DataTypes.DATE,
    invcdh_upd_by: DataTypes.STRING,
    invcdh_upd_date: DataTypes.DATE,
    invcdh_cost: DataTypes.INTEGER,
    invcdh_avg_cost: DataTypes.INTEGER,
    invcdh_trn_oid: DataTypes.UUID
  }, {
    sequelize,
    schema: 'public',
    tableName: 'invcdh_mstr',
    modelName: 'InvcdhMstr',
    timestamps: false
  });
  return InvcdhMstr;
};
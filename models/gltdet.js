'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GltDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GltDet.init({
    glt_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    glt_dom_id: DataTypes.INTEGER,
    glt_en_id: DataTypes.INTEGER,
    glt_add_by: DataTypes.STRING,
    glt_add_date: DataTypes.DATE,
    glt_upd_by: DataTypes.STRING,
    glt_upd_date: DataTypes.DATE,
    glt_gl_oid: DataTypes.UUID,
    glt_code: DataTypes.STRING,
    glt_date: DataTypes.DATEONLY,
    glt_type: DataTypes.STRING,
    glt_cu_id: DataTypes.INTEGER,
    glt_exc_rate: DataTypes.INTEGER,
    glt_seq: DataTypes.INTEGER,
    glt_ac_id: DataTypes.INTEGER,
    glt_sb_id: DataTypes.INTEGER,
    glt_cc_id: DataTypes.INTEGER,
    glt_desc: DataTypes.STRING,
    glt_debit: DataTypes.INTEGER,
    glt_credit: DataTypes.INTEGER,
    glt_ref_tran_id: DataTypes.INTEGER,
    glt_ref_trans_code: DataTypes.STRING,
    glt_posted: DataTypes.STRING,
    glt_dt: DataTypes.DATE,
    glt_daybook: DataTypes.STRING,
    glt_ref_oid: DataTypes.UUID,
    glt_is_reverse: DataTypes.STRING,
    glt_is_gen_ros: DataTypes.STRING,
    glt_desc_detail: DataTypes.STRING,
    glt_ref_detail_no: DataTypes.STRING,
    glt_check_status: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'glt_det',
    timestamps: false,
    modelName: 'GltDet',
  });
  return GltDet;
};
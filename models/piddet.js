'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PidDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PidDet.belongsTo(models.PtMstr, {
        as: 'data_product',
        targetKey: 'pt_id',
        foreignKey: 'pid_pt_id'
      })

      PidDet.hasOne(models.PiddDet, {
        as: 'singular_detail_pricelist',
        sourceKey: 'pid_oid',
        foreignKey: 'pidd_pid_oid'
      })

      PidDet.belongsTo(models.PiMstr, {
        as: 'header_pricelist',
        targetKey: 'pi_oid',
        foreignKey: 'pid_pi_oid'
      })
    }
  }
  PidDet.init({
    pid_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pid_add_by: DataTypes.STRING,
    pid_add_date: DataTypes.DATE,
    pid_upd_date: DataTypes.DATE,
    pid_upd_by: DataTypes.STRING,
    pid_pi_oid: DataTypes.UUID,
    pid_pt_id: DataTypes.INTEGER,
    pid_dt: DataTypes.DATE,
    pid_pt_tax_class: DataTypes.INTEGER,
    pid_pt_ppn_type: DataTypes.STRING,
    pid_pt_taxable: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'pid_det',
    timestamps: false,
    modelName: 'PidDet',
  });
  return PidDet;
};
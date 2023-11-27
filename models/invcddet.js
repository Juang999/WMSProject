'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvcdDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InvcdDet.belongsTo(models.LocsMstr, {
        as: 'sublocation',
        targetKey: 'losc_id',
        foreignKey: 'invcd_locs_id'
      })

      InvcdDet.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'invcd_pt_id'
      })
    }
  }
  InvcdDet.init({
    invcd_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    invcd_en_id: DataTypes.INTEGER,
    invcd_pt_id: DataTypes.INTEGER,
    invcd_qty: DataTypes.INTEGER,
    invcd_rfid: DataTypes.STRING,
    invcd_locs_id: DataTypes.INTEGER,
    invcd_color_code: DataTypes.STRING,
    invcd_remarks: DataTypes.STRING,
    invcd_add_date: DataTypes.DATE,
    invcd_add_by: DataTypes.STRING,
    invcd_upd_date: DataTypes.DATE,
    invcd_upd_by: DataTypes.STRING,
    invcd_weight: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'InvcdDet',
    tableName: 'invcd_det',
    timestamps: false
  });
  return InvcdDet;
};
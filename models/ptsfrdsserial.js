'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PtsfrdsSerial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PtsfrdsSerial.init({
    ptsfrds_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    ptsfrds_ptsfrd_oid: DataTypes.UUID,
    ptsfrds_qty: DataTypes.INTEGER,
    ptsfrds_qty_receive: DataTypes.INTEGER,
    ptsfrds_si_id: DataTypes.INTEGER,
    ptsfrds_loc_id: DataTypes.INTEGER,
    ptsfrds_lot_serial: DataTypes.STRING,
    ptsfrds_dt: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    tableName: 'ptsfrds_serial',
    timestamps: false,
    modelName: 'PtsfrdsSerial',
  });
  return PtsfrdsSerial;
};
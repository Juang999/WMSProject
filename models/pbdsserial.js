'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PbdsSerial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      PbdsSerial.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'pbds_pt_id'
      })

      PbdsSerial.belongsTo(models.PbdDet, {
        as: 'detail_ir',
        targetKey: 'pbd_oid',
        foreignKey: 'pbds_pbd_oid'
      })
    }
  }
  PbdsSerial.init({
    pbds_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    pbds_pbd_oid: DataTypes.UUID,
    pbds_pt_id: DataTypes.INTEGER,
    pbds_qrbarcode: DataTypes.STRING,
    pbds_created_by: DataTypes.STRING,
    pbds_created_at: DataTypes.DATE,
    pbds_loc_id: DataTypes.INTEGER,
    pbds_locs_id: DataTypes.INTEGER,
    pbds_loc_git: DataTypes.INTEGER,
    pbds_locs_git: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'pbds_serial',
    timestamps: false,
    modelName: 'PbdsSerial',
  });
  return PbdsSerial;
};
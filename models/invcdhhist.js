'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvcdhHist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InvcdhHist.belongsTo(models.LocMstr, {
        as: 'location_from',
        targetKey: 'loc_id',
        foreignKey: 'invcdh_loc_from_id'
      })

      InvcdhHist.belongsTo(models.LocMstr, {
        as: 'location_to',
        targetKey: 'loc_id',
        foreignKey: 'invcdh_loc_to_id'
      })

      InvcdhHist.belongsTo(models.LocsMstr, {
        as: 'sublocation_from',
        targetKey: 'locs_id',
        foreignKey: 'invcdh_locs_from_id'
      })

      InvcdhHist.belongsTo(models.LocsMstr, {
        as: 'sublocation_to',
        targetKey: 'locs_id',
        foreignKey: 'invcdh_locs_to_id'
      })

      InvcdhHist.belongsTo(models.PtMstr, {
        as: 'product',
        targetKey: 'pt_id',
        foreignKey: 'invcdh_pt_id'
      })

      InvcdhHist.belongsTo(models.EnMstr, {
        as: 'entity',
        targetKey: 'en_id',
        foreignKey: 'invcdh_en_id'
      })
    }
  }
  InvcdhHist.init({
    invcdh_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    invcdh_dom_id: DataTypes.INTEGER,
    invcdh_en_id: DataTypes.INTEGER,
    invcdh_pt_id: DataTypes.INTEGER,
    invcdh_loc_from_id: DataTypes.INTEGER,
    invcdh_loc_to_id: DataTypes.INTEGER,
    invcdh_locs_from_id: DataTypes.INTEGER,
    invcdh_locs_to_id: DataTypes.INTEGER,
    invcdh_qrbarcode: DataTypes.STRING,
    invcdh_status: DataTypes.STRING,
    invcdh_remarks: DataTypes.STRING,
    invcdh_created_by: DataTypes.STRING,
    invcdh_created_date: DataTypes.DATE
  }, {
    sequelize,
    schema: 'public',
    tableName: 'invcdh_hist',
    timestamps: false,
    modelName: 'InvcdhHist',
  });
  return InvcdhHist;
};
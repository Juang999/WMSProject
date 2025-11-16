'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TConfSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TConfSetting.init({
    create_jurnal: {
      type: DataTypes.BOOLEAN,
      primaryKey: false
    },
    server_code: DataTypes.STRING,
    xmpp_name: DataTypes.STRING,
    xmpp_ip: DataTypes.STRING,
    http_foto: DataTypes.STRING,
    version_code: DataTypes.STRING,
    version_id: DataTypes.INTEGER,
    serv_code: DataTypes.STRING,
    so_directly: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'tconfsetting',
    timestamps: false,
    modelName: 'TConfSetting',
  });
  return TConfSetting;
};
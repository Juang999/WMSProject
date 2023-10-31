'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TSqlOut extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TSqlOut.init({
    sql_uid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    seq: DataTypes.INTEGER,
    sql_command: DataTypes.STRING,
    waktu: DataTypes.DATE,
    mili_second: DataTypes.INTEGER,
    status_process: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'TSqlOut',
    tableName: 't_sql_out',
    timestamps: false
  });
  return TSqlOut;
};
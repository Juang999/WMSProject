'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TConfUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TConfUser.belongsTo(models.TConfGroup, {
        as: 'tconfgroup',
        targetKey: 'groupid',
        foreignKey: 'groupid'
      })
    }
  }
  TConfUser.init({
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    userkode: DataTypes.STRING,
    usernama: DataTypes.STRING,
    password: DataTypes.STRING,
    groupid: DataTypes.INTEGER,
    last_access: DataTypes.DATE,
    id_karyawan: DataTypes.INTEGER,
    time_reminder: DataTypes.INTEGER,
    en_id: DataTypes.INTEGER,
    useractive: DataTypes.STRING,
    useremail: DataTypes.STRING,
    usernik: DataTypes.STRING,
    userpidgin: DataTypes.STRING,
    userpidgin_hris: DataTypes.STRING,
    userphone: DataTypes.STRING,
    user_ptnr_id: DataTypes.INTEGER,
    user_imei: DataTypes.STRING,
    nik_id: DataTypes.STRING,
    user_ptnrg_id: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    modelName: 'TConfUser',
    tableName: 'tconfuser',
    timestamps: false,
  });
  return TConfUser;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TokenStorage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TokenStorage.init({
    token_user_id: DataTypes.INTEGER,
    token_token: DataTypes.STRING,
    token_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    }
  }, {
    sequelize,
    schema: 'public',
    modelName: 'TokenStorage',
    tableName: 'token_storage',
    timestamps: false
  });
  return TokenStorage;
};
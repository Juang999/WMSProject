const { Sequelize, DataTypes } = require('sequelize')
const { config } = require('../../config/environment');
const stage = (config.parsed.NODE_ENV) ? config.parsed.NODE_ENV : 'development';
const configuration = require('../../config/database-getdesc')[stage];

const sequelize = new Sequelize(
    configuration.DB_GETDESC_DATABASE, 
    configuration.DB_GETDESC_USERNAME, 
    configuration.DB_GETDESC_PASSWORD, 
    configuration
);

module.exports = {sequelize, DataTypes};
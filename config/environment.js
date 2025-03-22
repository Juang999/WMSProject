// let path = 'C:/Users/user/Project/WMSProject'
let path = '/var/www/wms-dev'

module.exports = {
    config: require('dotenv').config({path: `${path}/.env`}),
    development: require('dotenv').config({path: `${path}/.env.development`}),
    testing: require('dotenv').config({path: `${path}/.env.development`}),
    production:  require('dotenv').config({path: `${path}/.env.production`}),
}
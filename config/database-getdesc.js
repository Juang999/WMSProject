const {development: devEnv, testing: testEnv, production: proEnv} = require('./environment'); 

module.exports = {
    development: {
        database: devEnv.parsed.DB_GETDESC_DATABASE,
        host: devEnv.parsed.DB_GETDESC_HOST,
        port: devEnv.parsed.DB_GETDESC_PORT,
        username: devEnv.parsed.DB_GETDESC_USERNAME,
        password: devEnv.parsed.DB_GETDESC_PASSWORD,
        dialect: devEnv.parsed.DB_GETDESC_DIALECT,
        timezone: devEnv.parsed.DB_GETDESC_TIMEZONE, 
        logging: false,
        pool: {
            max: parseInt(devEnv.parsed.DB_GETDESC_MAX),
            min: parseInt(devEnv.parsed.DB_GETDESC_MIN),
            acquire: parseInt(devEnv.parsed.DB_GETDESC_ACQUIRE),
            idle: parseInt(devEnv.parsed.DB_GETDESC_IDLE)
        }
    },
    testing: {
        database: testEnv.parsed.DB_GETDESC_DATABASE,
        host: testEnv.parsed.DB_GETDESC_HOST,
        port: testEnv.parsed.DB_GETDESC_PORT,
        username: testEnv.parsed.DB_GETDESC_USERNAME,
        password: testEnv.parsed.DB_GETDESC_PASSWORD,
        dialect: testEnv.parsed.DB_GETDESC_DIALECT,
        timezone: testEnv.parsed.DB_GETDESC_TIMEZONE,
        logging: false,
        pool: {
            max: parseInt(testEnv.parsed.DB_GETDESC_MAX),
            min: parseInt(testEnv.parsed.DB_GETDESC_MIN),
            acquire: parseInt(testEnv.parsed.DB_GETDESC_ACQUIRE),
            idle: parseInt(testEnv.parsed.DB_GETDESC_IDLE)
        }
    },
    production: {
        database: proEnv.parsed.DB_GETDESC_DATABASE,
        host: proEnv.parsed.DB_GETDESC_HOST,
        port: proEnv.parsed.DB_GETDESC_PORT,
        username: proEnv.parsed.DB_GETDESC_USERNAME,
        password: proEnv.parsed.DB_GETDESC_PASSWORD,
        dialect: proEnv.parsed.DB_GETDESC_DIALECT,
        timezone: proEnv.parsed.DB_GETDESC_TIMEZONE,
        logging: false,
        pool: {
            max: parseInt(proEnv.parsed.DB_GETDESC_MAX),
            min: parseInt(proEnv.parsed.DB_GETDESC_MIN),
            acquire: parseInt(proEnv.parsed.DB_GETDESC_ACQUIRE),
            idle: parseInt(proEnv.parsed.DB_GETDESC_IDLE)
        }
    },
}
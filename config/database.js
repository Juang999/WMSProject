const {development: devEnv, testing: testEnv, production: proEnv, production} = require('./environment'); 

module.exports = {
    development: {
        database: devEnv.parsed.DB_DATABASE,
        host: devEnv.parsed.DB_HOST,
        port: devEnv.parsed.DB_PORT,
        username: devEnv.parsed.DB_USERNAME,
        password: devEnv.parsed.DB_PASSWORD,
        dialect: devEnv.parsed.DB_DIALECT,
        timezone: devEnv.parsed.DB_TIMEZONE,
        logging: false,
        pool: {
            max: parseInt(devEnv.parsed.DB_MAX),
            min: parseInt(devEnv.parsed.DB_MIN),
            acquire: parseInt(devEnv.parsed.DB_ACQUIRE),
            idle: parseInt(devEnv.parsed.DB_IDLE)
        }
    },
    testing: {
        database: testEnv.parsed.DB_DATABASE,
        host: testEnv.parsed.DB_HOST,
        port: testEnv.parsed.DB_PORT,
        username: testEnv.parsed.DB_USERNAME,
        password: testEnv.parsed.DB_PASSWORD,
        dialect: testEnv.parsed.DB_DIALECT,
        timezone: testEnv.parsed.DB_TIMEZONE,
        logging: false,
        pool: {
            max: parseInt(testEnv.parsed.DB_MAX),
            min: parseInt(testEnv.parsed.DB_MIN),
            acquire: parseInt(testEnv.parsed.DB_ACQUIRE),
            idle: parseInt(testEnv.parsed.DB_IDLE)
        }
    },
    production: {
        database: proEnv.parsed.DB_DATABASE,
        host: proEnv.parsed.DB_HOST,
        port: proEnv.parsed.DB_PORT,
        username: proEnv.parsed.DB_USERNAME,
        password: proEnv.parsed.DB_PASSWORD,
        dialect: proEnv.parsed.DB_DIALECT,
        timezone: proEnv.parsed.DB_TIMEZONE,
        logging: false,
        pool: {
            max: parseInt(proEnv.parsed.DB_MAX),
            min: parseInt(proEnv.parsed.DB_MIN),
            acquire: parseInt(proEnv.parsed.DB_ACQUIRE),
            idle: parseInt(proEnv.parsed.DB_IDLE)
        }
    },
}
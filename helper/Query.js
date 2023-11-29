const {TSqlOut} = require('../models')
const {v4: uuidv4} = require('uuid')
const moment = require('moment')

class Query {
    insert = async (sql, bind) => {
        let query = sql
        let keys = Object.keys(bind.bind)
        query = query.replace("Executing (default): ", '')

        for (const key of keys) {
            let value = (typeof bind.bind[key] === "string") ? `"${bind.bind[key]}"` : `${bind.bind[key]}`
            query = query.replace(key, value)
        }

        await TSqlOut.create({
            sql_uid: uuidv4(),
            seq: 1,
            sql_command: query,
            waktu: moment().format('YYYY-MM-DD HH:mm:ss'),
            mili_second: (bind.miliSecond) ? bind.miliSecond : 100
        })
    }

    delete = async (sql) => {
        await TSqlOut.create({
            sql_uid: uuidv4(),
            seq: 1,
            sql_command: sql,
            waktu: moment().format('YYYY-MM-DD HH:mm:ss'),
            mili_second: 100
        })
    }

    queryBulkCreate = async (sql) => {
        let sqlCommand = sql.replace("Executing (default): ", "")
        await TSqlOut.create({
            sql_uid: uuidv4(),
            seq: 1,
            sql_command: sqlCommand,
            waktu: moment().format('YYYY-MM-DD HH:mm:ss'),
            mili_second: 100
        })
    }
}

module.exports = new Query()
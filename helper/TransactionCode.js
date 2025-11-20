const Server = require('./Server');
const moment = require('moment');

class TransactionCode {
    generate = async ( codeTransaction, entityId, sequence ) => {
        let montlyId = '000';
        let baseSequence = '0000';
        let sqSequence = sequence + 1;
        let entityCode = `${entityId}0`;
        let yearPlusMonth = moment().format('YYMM');
        let serverCode = await Server.server(['server_code']);
        let dataSequence = baseSequence.slice(0, -sqSequence.toString().length) + sqSequence;

        return codeTransaction + entityCode + yearPlusMonth + serverCode['server_code'] + montlyId + dataSequence;
    }
}

module.exports = new TransactionCode();
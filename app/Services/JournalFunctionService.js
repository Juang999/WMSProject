const { retrieveProdLineAccount } = require('./JournalQueryService');

class JournalFunctionService {
    shipmentJournaling = async ( dataJournal, transaction ) => {
        if (dataJournal.qty > 0) {
            let dataProductLine = await retrieveProdLineAccount()
        }
    }
}

module.exports = new JournalFunctionService();
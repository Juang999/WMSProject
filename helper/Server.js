const { TConfSetting } = require('../models');

class Server {
    server = async ( columnsArray ) => {
        let columns = columnsArray || ['create_jurnal', 'server_code', 'xmpp_name', 'xmpp_ip', 'http_foto', 'version_code', 'version_id', 'serv_code', 'so_directly'];

        let {dataValues: result} = await TConfSetting.findOne({
            attributes: columns
        });

        return result;
    }
}

module.exports = new Server()
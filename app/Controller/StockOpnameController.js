const Auth = require('../../helper/auth');
const {InventoryService, OpnameService} = require('../Services/ServiceContainer');

class StockOpnameController {
    index = (req, res) => {
        let {userid} = Auth.user(req.get('authorization').split(" ")[1]);

        OpnameService.retrieveDataOpname(userid)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }
}

module.exports = new StockOpnameController();
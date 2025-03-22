const {OpnameService} = require('../Services/ServiceContainer');
const Auth = require('../../helper/auth');

class OpnameController {
    index = (req, res) => {
        let {userid} = Auth();

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

module.exports = new OpnameController();
const { TransferService } = require('../Services/ServiceContainer');

class TransferController {
    findDataTransfer = (req, res) => {
        TransferService.findDataTransfer(req.params.transfer_code)
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

module.exports = new TransferController();
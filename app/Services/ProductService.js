const {PtMstr} = require('../../models');

class ProductService {
    findProductByPartnumber = async (partnumber) => {
        let result = await PtMstr.findOne({
            attributes: [
                'pt_en_id',
                'pt_id',
            ],
            where: {
                pt_code: partnumber
            }
        })

        return result;
    }
}

module.exports = new ProductService();
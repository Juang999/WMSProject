const {EnMstr} = require('../../models');
const {Op} = require('sequelize');

class MasterService {
    getEntity = async () => {
        const result = await EnMstr.findAll({
            attributes: ['en_id', 'en_desc'],
            where: {
                en_id: {
                    [Op.not]: 0
                }
            }
        })

        return result;
    }
}

module.exports = new MasterService();
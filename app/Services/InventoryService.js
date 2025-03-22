const {
    LocMstr, InvcMstr,
    RiuMstr, RiudDet
} = require('../../models');
const {Op} = require('sequelize');

class InventoryService {
    getLocName = async (search) => {
        let result = await LocMstr.findAll({
            attributes: ['loc_id', 'loc_desc'],
            where: {
                loc_desc: {
                    [Op.iLike]: `%${search}%`
                }
            }
        });

        return result;
    }
}

module.exports = new InventoryService();
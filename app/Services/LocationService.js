const {LocMstr} = require('../../models');
const {Op} = require('sequelize');

class LocationService {
    findLocations = async (locId) => {
        let result = await LocMstr.findAll({
            attributes: ['loc_id', 'loc_desc'],
            where: {
                loc_id: {
                    [Op.in]: locId
                }
            }
        })

        return result;
    }
}

module.exports = new LocationService();
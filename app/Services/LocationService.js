const {
    Sequelize,
    LocMstr, LocsMstr, 
} = require('../../models');
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

    getSimpleDataLocation = async (entity_id, search) => {
        let result = await LocMstr.findAll({
            attributes: ['loc_id', 'loc_desc'],
            where: {
                loc_en_id: entity_id,
                loc_desc: {
                    [Op.iLike]: `%${search}%`
                }
            }
        });

        return result;
    }

    findSublocation = async (locsId) => {
        let result = await LocsMstr.findOne({
            attributes: [
                'locs_id',
                ['locs_loc_id', 'loc_id'],
                ['locs_name', 'sublocation_name'],
                [Sequelize.col('"location"."loc_desc"'), 'location_name'],
                ['locs_cap', 'capacity']
            ],
            include: [
                {
                    model: LocMstr,
                    as: 'location',
                    attributes: []
                }
            ],
            where: {
                locs_id: locsId
            }
        })

        return result;
    }

    findLocation = async (locId) => {
        let result = await LocMstr.findOne({
            attributes: [
                'loc_id',
                ['loc_desc', 'location_name']
            ],
            where: {
                loc_id: locId
            }
        })

        return result;
    }
}

module.exports = new LocationService();
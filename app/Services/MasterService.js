const {EnMstr, PtCatMstr, LocsMstr} = require('../../models');
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

    getCategory = async () => {
        let result = await PtCatMstr.findAll({
            attributes: ['ptcat_id', 'ptcat_desc'],
        })

        return result;
    }

    getSublocation = async (locId, search) => {
        let result = await LocsMstr.findAll({
            attributes: [
                ['locs_name', 'subloc_name'],
                ['locs_id', 'subloc_id'],
                ['locs_loc_id', 'loc_id'],
                ['locs_cap', 'subloc_capacity']
            ],
            where: {
                locs_loc_id: locId,
                locs_active: 'Y',
                locs_name: {
                    [Op.iLike]: `%${search}%`
                }
            }
        });

        return result;
    }
}

module.exports = new MasterService();
const {EnMstr, PtCatMstr, InvcdDet, LocsMstr, Sequelize} = require('../../models');
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
        let result = await InvcdDet.findAll({
            attributes: [
                [Sequelize.col('"sublocation"."locs_name"'), 'subloc_name'],
                [Sequelize.col('"sublocation"."locs_id"'), 'subloc_id'],
                [Sequelize.col('"sublocation"."locs_loc_id"'), 'loc_id'],
                [Sequelize.col('"sublocation"."locs_cap"'), 'subloc_capacity'],
                [Sequelize.literal(`CASE WHEN SUM(invcd_qty) IS NULL THEN 0 ELSE CAST(SUM(invcd_qty) AS INTEGER) END`), 'scanned']
            ],
            include: [
                {
                    model: LocsMstr,
                    right: true,
                    as: 'sublocation',
                    attributes: []
                }
            ],
            where:[
                Sequelize.where(Sequelize.col(`"sublocation"."locs_loc_id"`), {
                    [Op.eq]: locId
                }),
                Sequelize.where(Sequelize.col(`"sublocation"."locs_name"`), {
                    [Op.iLike]: `%${search}%`
                }),
                Sequelize.where(Sequelize.col(`invcd_deleted_at`), {
                    [Op.eq]: null
                }),
                Sequelize.where(Sequelize.col(`invcd_deleted_by`), {
                    [Op.eq]: null
                })
            ],
            group: [
                Sequelize.col('"sublocation"."locs_name"'),
                Sequelize.col('"sublocation"."locs_id"'),
                Sequelize.col('"sublocation"."locs_loc_id"'),
                Sequelize.col('"sublocation"."locs_cap"'),
                Sequelize.col(`invcd_deleted_at`),
                Sequelize.col(`invcd_deleted_by`)
            ]
        })

        return result;
    }
}

module.exports = new MasterService();
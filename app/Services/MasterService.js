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
        let result = await LocsMstr.findAll({
            attributes: [
                ["locs_name", "subloc_name"],
                ['locs_id', 'subloc_id'],
                ['locs_loc_id', 'loc_id'],
                ['locs_cap', 'capacity'],
                [Sequelize.literal(`CASE WHEN COUNT("serial"."invcd_oid") IS NULL THEN 0 ELSE COUNT("serial"."invcd_oid") END`), 'scanned']
            ],
            include: [
                {
                    model: InvcdDet,
                    as: 'serial',
                    required: false,
                    attributes: [],
                    where: {
                        invcd_deleted_at: null,
                        invcd_deleted_by: null,
                        invcd_qty: 1,
                        invcd_qrbarcode: {
                            [Op.not]: null
                        }
                    }
                }
            ],
            where: {
                locs_loc_id: locId,
                locs_name: {
                    [Op.iLike]: `%${search}%`
                }
            },
            group: [
                Sequelize.col('locs_name'),
                Sequelize.col('locs_id'),
                Sequelize.col('locs_loc_id'),
                Sequelize.col('locs_cap'),
            ],
            order: [
                [Sequelize.col('scanned'), 'DESC']
            ],
            logging: (sqlCommand) => {
                console.info(sqlCommand)
            }
        })

        return result;
    }
}

module.exports = new MasterService();
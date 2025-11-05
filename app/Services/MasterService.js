const {EnMstr, PtCatMstr, InvcdDet, LocsMstr, SiMstr, AcMstr, SbMstr, CcMstr, Sequelize} = require('../../models');
const {Op} = require('sequelize');

class MasterService {
    getSite = async () => {
        let result = await SiMstr.findAll({
            attributes: [
                ['si_id', 'site_id'],
                ['si_desc', 'site_desc']
            ]
        });

        return result;
    }
    
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
                ['locs_cap', 'subloc_capacity'],
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
            ]
        })

        return result;
    }

    retrieveAccount = async () => {
        let result = await AcMstr.findAll({
            attributes: [
                ['ac_id', 'account_id'],
                ['ac_code', 'account_code'],
                ['ac_name', 'account_name']
            ],
            order: [
                ['ac_id', 'ASC']
            ]
        });

        return result;
    }

    retrieveSubAccount = async () => {
        let result = await SbMstr.findAll({
            attributes: [
                ['sb_id', 'subaccount_id'],
                ['sb_code', 'subaccount_code'],
                ['sb_desc', 'subaccount_desc']
            ]
        });

        return result;
    }

    retrieveCostCenter = async () => {
        let result = await CcMstr.findAll({
            attributes: [
                ['cc_id', 'cost_center_id'],
                ['cc_code', 'cost_center_code'],
                ['cc_desc', 'cost_center_desc'],
            ],
            order: [
                ['cc_id', 'ASC']
            ]
        });

        return result;
    }
}

module.exports = new MasterService();
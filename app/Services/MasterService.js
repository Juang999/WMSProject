const {
    BkMstr,
    SiMstr, AcMstr, 
    SbMstr, CcMstr, 
    CuMstr, TranMstr,
    EnMstr, PtCatMstr, 
    InvcdDet, LocsMstr, 
    Sequelize, AreaMstr,
    CodeMstr, SlsProgram,
} = require('../../models');
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

    retrieveAreaPriceList = async () => {
        let result = await AreaMstr.findAll({
            attributes: ['area_id', 'area_code', 'area_name'],
            order: [
                ['area_id', 'ASC']
            ]
        });

        return result;
    }

    retrieveDataCodeMstrByCodeField = async ( codeField ) => {
        let result = await CodeMstr.findAll({
            attributes: ['code_id', 'code_field', 'code_name'],
            where: {
                code_field: codeField
            }
        });

        return result;
    }

    retrieveSalesProgram = async ( salesProgramName ) => {
        let result = await SlsProgram.findAll({
            attributes: [
                ['sls_id', 'sales_program_id'], 
                ['sls_code', 'sales_program_code'], 
                ['sls_name', 'sales_program_name']
            ],
            where: {
                sls_name: {
                    [Op.iLike]: `%${salesProgramName}%`
                }
            }
        });

        return result;
    }

    retrieveCurrency = async () => {
        let result = await CuMstr.findAll({
            attributes: [
                ['cu_id', 'currency_id'],
                ['cu_code', 'currency_code'],
                ['cu_name', 'currency_name']
            ]
        });

        return result;
    } 

    retrieveDataApproval = async () => {
        let result = await TranMstr.findAll({
            attributes: ['tran_id', 'tran_name', 'tran_desc'],
            order: [
                ['tran_id', 'ASC']
            ]
        });

        return result;
    }

    retrieveDataBank = async () => {
        let result = await BkMstr.findAll({
            attributes: ['bk_id', 'bk_code', 'bk_name'],
            order: [
                ['bk_id', 'ASC']
            ]
        });

        return result;
    }
}

module.exports = new MasterService();
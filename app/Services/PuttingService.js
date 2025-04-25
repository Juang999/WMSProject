const {InvcdDet, LocsMstr, PtMstr, Sequelize} = require('../../models');
const {v4: uuidV4} = require('uuid');
const moment = require('moment');
const {Op} = require('sequelize');
const Query = require('../../helper/Query');

class PuttingService {
    putProductIntoSubLocation = async (body, transaction) => {
        await InvcdDet.create({
            invcd_oid: uuidV4(),
            invcd_dom_id: 1,
            invcd_en_id: body.en_id,
            invcd_pt_id: body.pt_id,
            invcd_qrbarcode: body.qrbarcode,
            invcd_qty: 1,
            invcd_loc_id: body.loc_id,
            invcd_locs_id: body.locs_id,
            invcd_um: 9964,
            invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            invcd_add_by: 'system',
            invcd_date: moment().format('YYYY-MM-DD'),
            invcd_is_verified: 'Y'
        }, {
            transaction
        })
    }

    getSpesificSublocation = async (locsId) => {
        let result = await LocsMstr.findOne({
            attributes: [
                'locs_id',
                ['locs_loc_id', 'loc_id'],
                ['locs_name', 'sublocation_name'],
                ['locs_cap', 'capacity']
            ],
            where: {
                locs_id: locsId
            }
        })

        return result;
    }

    getProduct = async (locsId) => {
        let result = await InvcdDet.findAll({
            attributes: [
                [Sequelize.col(`"product"."pt_id"`), 'product_id'],
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                [Sequelize.literal(`CAST(SUM("invcd_qty") AS INTEGER)`), 'qty'],
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }
            ],
            where: {
                invcd_locs_id: locsId
            },
            group: [
                Sequelize.col(`"product"."pt_id"`),
                Sequelize.col(`"product"."pt_code"`),
                Sequelize.col(`"product"."pt_desc1"`),
            ],
        })

        return result;
    }

    getTotalSerialInSublocation = async (locsId) => {
        let result = await InvcdDet.count({
            where: {
                invcd_locs_id: locsId,
                invcd_qty: 1
            }
        })

        return result;
    }

    getDataSerialBySubLocation = async (subLocId) => {
        let result = await InvcdDet.findAndCountAll({
            attributes: [
                'invcd_oid',
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                ['invcd_qrbarcode', 'uniq'],
                [Sequelize.col(`"sublocation"."locs_name"`), 'sublocation'],
                [Sequelize.literal(`CAST(invcd_qty AS INTEGER)`), 'qty'],
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }, {
                    model: LocsMstr,
                    as: 'sublocation',
                    attributes: []
                }
            ],
            where: {
                invcd_locs_id: subLocId
            }
        })

        return result;
    }

    deleteSerial = async (invcdOid) => {
        await InvcdDet.destroy({
            where: {
                invcd_oid: invcdOid
            },
            logging: (sqlCommand) => {
                let realSql = sqlCommand.split(": ")[1];

                Query.delete(realSql);
            }
        })

        return 1;
    }

    updateSerial = async (invcdOid, serialNumber, subLocation, transaction) => {
        await InvcdDet.update({
            invcd_dom_id: 1,
            invcd_locs_id: subLocation,
            invcd_qrbarcode: serialNumber,
            invcd_is_verified: 'Y',
            invcd_um: 9964,
            invcd_upd_by: 'system',
            invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                invcd_oid: invcdOid
            },
            transaction
        })
    }
}

module.exports = new PuttingService();
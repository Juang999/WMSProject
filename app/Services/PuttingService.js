const {InvcdDet, LocsMstr} = require('../../models');
const {v4: uuidV4} = require('uuid');
const moment = require('moment');
const {Op} = require('sequelize');

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
                ['locs_cap', 'capacity']
            ],
            where: {
                locs_id: locsId
            }
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
}

module.exports = new PuttingService();
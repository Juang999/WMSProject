const {
    PtMstr, LocMstr,
    SomMstr, TConfUser, Sequelize
} = require('../../models');

class OpnameService {
    retrieveDataOpname = async (userid) => {
        let result = await SomMstr.findAll({
            attributes: [
                'som_oid',
                [Sequelize.col(`"user_pic"."usernama"`), 'pic'],
                ['som_code', 'opname_code'],
                ['som_loc_id', 'location_id'],
                [Sequelize.literal(`CASE WHEN "location"."loc_desc" IS NULL THEN '-' ELSE "location"."loc_desc" END`), 'location_name'],
                ['som_pt_id', 'product_id'],
                [Sequelize.literal(`CASE WHEN "product"."pt_desc1" IS NULL THEN '-' ELSE "product"."pt_desc1" END`), 'product_name'],
                ['som_remarks', 'remarks'],
                ['som_status', 'status'],
                ['som_locked', 'lock_status'],
                ['som_start_date', 'start_date'],
                ['som_end_date', 'end_date'],
            ],
            include: [
                {
                    model: TConfUser,
                    as: 'user_pic',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location',
                    attributes: []
                }, {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }
            ],
            where: {
                som_user_id: userid
            }
        })

        return result;
    }
}

module.exports = new OpnameService();
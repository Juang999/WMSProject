const {
    InvcMstr,
    PtMstr, LocMstr,
    SomMstr, SomdDet, 
    TConfUser, Sequelize
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

    retrieveDetailOpname = async (opnameCode) => {
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
                }, {
                    model: SomdDet,
                    as: 'detail_opname',
                    attributes: [
                        'somd_oid',
                        ['somd_invc_oid', 'invc_oid'],
                        ['somd_pt_id', 'product_id'],
                        [Sequelize.literal(`"detail_opname->product"."pt_desc1"`), 'product_name'],
                        [Sequelize.literal(`"detail_opname->product"."pt_code"`), 'product_code'],
                        [Sequelize.literal(`"detail_opname->data_inventory"."invc_loc_id"`), 'location_id'],
                        [Sequelize.literal(`"detail_opname->data_inventory->location"."loc_desc"`), 'location_name'],
                        [Sequelize.literal('CAST(somd_qty_sys AS BIGINT)'), 'qty_system'],
                        [Sequelize.literal('CAST(somd_qty_real AS BIGINT)'), 'qty_real'],
                        [Sequelize.literal('CAST(somd_variance AS BIGINT)'), 'qty_variance'],
                    ],
                    include: [
                        {
                            model: InvcMstr,
                            as: 'data_inventory',
                            attributes: [],
                            include: [
                                {
                                    model: LocMstr,
                                    as: 'location',
                                    attributes: []
                                }
                            ]
                        }, {
                            model: PtMstr,
                            as: 'product',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                som_code: opnameCode
            },
            subQuery: false,
        })

        return result[0];
    }
}

module.exports = new OpnameService();
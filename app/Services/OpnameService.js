const {
    SomddDet,
    PtMstr, LocMstr,
    SomMstr, SomdDet, 
    InvcMstr, InvcdDet,
    TConfUser, Sequelize
} = require('../../models');
const {Query} = require('../../helper/helper');
const {Op} = require('sequelize');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');

class OpnameService {
    retrieveDataOpname = async () => {
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

    retrieveSerialOpname = async (somdOid) => {
        let result = await SomddDet.findAll({
            attributes: [
                ['somdd_serial', 'uniq'],
                ['somdd_created_date', 'created_date']
            ],
            where: {
                somdd_somd_oid: somdOid
            }
        })

        return result;
    }

    addQtyOpname = async (somdOid, transaction) => {
        await SomdDet.update({
            somd_qty_real: Sequelize.literal(`CAST(somd_qty_real AS INTEGER) + 1`)
        }, {
            where: {
                somd_oid: somdOid
            },
            transaction,
            logging: (sqlCommand, {bind}) => {
                let realSql = sqlCommand.split(': ')[1]

                Query.insert(realSql, bind)
            }
        })
    }

    findSerialNumber = async (serialNumber, productCode, transaction) => {
        let result = await InvcdDet.findOne({
            attributes: [
                [Sequelize.col('"product"."pt_desc1"'), 'product_name'],
                ['invcd_qrbarcode', 'uniq'],
                ['invcd_alias_qrbarcode', 'alias_uniq'],
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }
            ],
            where: {
                [Op.or]: [
                    {
                        invcd_qrbarcode: serialNumber
                    }, {
                        [Op.and]: [
                            Sequelize.where(Sequelize.col('invcd_alias_qrbarcode'), {
                                [Op.eq]: serialNumber
                            }),
                            Sequelize.where(Sequelize.col(`"product"."pt_code"`), {
                                [Op.eq]: productCode
                            })
                        ]
                    }
                ]
            },
            transaction
        })

        return result;
    }

    createSerialNumber = async (serialNumber, product, locId, transaction) => {
        let result = await InvcdDet.create({
            invcd_oid: uuidv4(),
            invcd_dom_id: 1,
            invcd_en_id: product.pt_en_id,
            invcd_pt_id: product.pt_id,
            invcd_qty: 1,
            invcd_qrbarcode: serialNumber,
            invcd_loc_id: locId,
            invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            invcd_add_by: 'system',
            invcd_si_id: 992,
            invcd_date: moment().format('YYYY-MM-DD'),
            invcd_is_verified: 'Y',
        }, {
            transaction,
            logging: (sqlCommand, {bind}) => {
                let realSql = sqlCommand.split(': ')[1];

                Query.insert(realSql, bind);
            }
        })

        return result;
    }

    updateSerialNumber = async (serialNumber, productCode, locId, transaction) => {
        let result = await InvcdDet.update({
            invcd_qrbarcode: serialNumber,
            invcd_qty: 1,
            invcd_loc_id: locId,
            invcd_qty_old: 0,
            invcd_add_by: 'system',
            invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                invcd_pt_id: {
                    [Op.eq]: Sequelize.literal(`(SELECT pt_id FROM public.pt_mstr WHERE pt_code = '${productCode}')`)
                },
                invcd_alias_qrbarcode: serialNumber
            },
            transaction,
            logging: (sqlCommand, {bind}) => {
                let realSql = sqlCommand.split(': ')[1];

                Query.insert(realSql, bind);
            }
        })

        return result;
    }

    createDetailOpname = async (somdOid, productId, locId, serialNumber, transaction) => {
        let result = await SomddDet.create({
            somdd_oid: uuidv4(),
            somdd_somd_oid: somdOid,
            somdd_pt_id: productId,
            somdd_loc_id: locId,
            somdd_serial: serialNumber,
            somdd_qty_sys: 1,
            somdd_qty_real: 1,
            somdd_created_by: 'system',
            somdd_created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        }, {
            transaction,
            logging: (sqlCommand, {bind}) => {
                let realSql = sqlCommand.split(': ')[1];

                Query.insert(realSql, bind);
            }
        })

        return result;
    }
}

module.exports = new OpnameService();
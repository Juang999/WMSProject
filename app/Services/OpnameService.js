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
                [Sequelize.literal(`(SELECT CAST(SUM(somd_qty_real) AS BIGINT) FROM public.somd_det WHERE somd_som_oid = som_oid)`), 'counted']
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
                        [Sequelize.literal(`"detail_opname"."somd_loc_id"`), 'location_id'],
                        [Sequelize.literal(`"detail_opname->data_inventory->location"."loc_desc"`), 'location_name'],
                        [Sequelize.literal('CAST("detail_opname"."somd_qty_sys" AS BIGINT)'), 'qty_system'],
                        [Sequelize.literal('CAST("detail_opname"."somd_qty_real" AS BIGINT)'), 'qty_real'],
                        [Sequelize.literal('CAST("detail_opname"."somd_variance" AS BIGINT)'), 'qty_variance'],
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
                ['somdd_somd_oid', 'somd_oid'],
                'somdd_oid',
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                ['somdd_serial', 'uniq'],
                ['somdd_created_date', 'created_date'],
                [Sequelize.literal('CAST(somdd_qty_sys AS INTEGER)'), 'qty_sys'],
                [Sequelize.literal('CAST(somdd_qty_real AS INTEGER)'), 'qty_real']
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }
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

    subtractQtyOpname = async (somddOid, transaction) => {
        await SomdDet.update({
            somd_qty_real: Sequelize.literal(`CAST(somd_qty_real AS INTEGER) - 1`)
        }, {
            where: {
                somd_oid: {
                    [Op.eq]: Sequelize.literal(`(SELECT somdd_somd_oid FROM public.somdd_det WHERE somdd_oid = '${somddOid}')`)
                }
            },
            transaction,
            logging: (sqlCommand, {bind}) => {
                let realSql = sqlCommand.split(': ')[1]

                Query.insert(realSql, bind)
            }
        })
    }

    findDetailOpname = async (somOid, partNumber, locId) => {
        let result = await SomdDet.findOne({
            attributes: ['somd_oid', 'somd_loc_id'],
            where: {
                somd_som_oid: somOid,
                somd_loc_id: locId,
                somd_pt_id: {
                    [Op.eq]: Sequelize.literal(`(SELECT pt_id FROM public.pt_mstr WHERE pt_code = '${partNumber}')`)
                }
            }
        })

        return result;
    }

    findSerialNumber = async (serialNumber, productCode, transaction) => {
        let result = await InvcdDet.findOne({
            attributes: [
                'invcd_oid',
                [Sequelize.col('"product"."pt_desc1"'), 'product_name'],
                [Sequelize.col('"product"."pt_code"'), 'product_code'],
                ['invcd_qrbarcode', 'uniq'],
                ['invcd_alias_qrbarcode', 'alias_uniq'],
                [Sequelize.literal('CAST(invcd_qty AS INTEGER)'), 'qty'],
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

    newFindSerialNumber = async (serialNumber, transaction) => {
        let result = await InvcdDet.findOne({
            attributes: [
                [Sequelize.col('"product"."pt_desc1"'), 'product_name'],
                [Sequelize.col('"product"."pt_code"'), 'product_code'],
                ['invcd_qrbarcode', 'uniq'],
                ['invcd_alias_qrbarcode', 'alias_uniq'],
                ['invcd_qty', 'qty'],
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
                        invcd_alias_qrbarcode: serialNumber
                    }
                ]
            },
            order: [['invcd_pt_id', 'ASC']],
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
            invcd_qty_old: Sequelize.literal(`invcd_qty`),
            invcd_is_verified: 'Y',
            invcd_add_by: 'system',
            invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                [Op.or]: [
                    {
                        invcd_qrbarcode: serialNumber
                    }, {
                        invcd_pt_id: {
                            [Op.eq]: Sequelize.literal(`(SELECT pt_id FROM public.pt_mstr WHERE pt_code = '${productCode}')`)
                        },
                        invcd_alias_qrbarcode: serialNumber,
                    }
                ],
                invcd_loc_id: locId
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

    storeHeaderOpname = async (body, user, transaction) => {
        let result = await SomMstr.create({
            som_oid: uuidv4(),
            som_en_id: body.entity_id,
            som_date: moment().format('YYYY-MM-DD'),
            som_code: '-',
            som_loc_id: body.location_id,
            som_group_code: body.group_code,
            som_pt_id: body.product_id,
            som_user_id: user.userid,
            som_remarks: body.remarks,
            som_status: 'Draft',
            som_qty_ttl: 0,
            som_created_by: user.usernama,
            som_created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            som_year: moment().format('YYYY'),
            som_start_date: body.start_date,
            som_end_date: body.end_date,
        }, {
            transaction
        });

        return result;
    }

    storeDetailOpname = async (data, transaction) => {
        await SomdDet.bulkCreate(data, {
            transaction
        });
    }

    retrieveSerial = async (location_id, product_id) => {
        let condition;

        if (location_id != null && product_id != null) {
            condition = {
                invcd_loc_id: location_id,
                invcd_pt_id: product_id
            }
        } else if (location_id != null && product_id == null) {
            condition = {
                invcd_loc_id: location_id
            }
        } else if (location_id == null && product_id != null) {
            condition = {
                invcd_pt_id: product_id
            }
        }

        let result = await InvcdDet.findAll({
            attributes: [
                [Sequelize.col(`"product"."pt_id"`), 'product_id'],
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"location"."loc_desc"`), 'location_name'],
                [Sequelize.literal(`CASE WHEN invcd_qrbarcode IS NOT NULL THEN invcd_qrbarcode ELSE invcd_alias_qrbarcode END`), 'uniq'],
                [Sequelize.literal('CAST(invcd_qty AS INTEGER)'), 'status']
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location',
                    attributes: []
                }
            ],
            where: condition
        });

        return result;
    }

    findSerialOpname = async (locationId, productCode, serial) => {
        let result = await SomddDet.findOne({
            attributes: [
                'somdd_oid',
                'somdd_pt_id',
                [Sequelize.literal(`CAST(somdd_qty_real AS INTEGER)`), 'qty']
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col(`somdd_loc_id`), {
                        [Op.eq]: locationId
                    }),
                    Sequelize.where(Sequelize.col(`"product"."pt_code"`), {
                        [Op.eq]: productCode
                    }),
                    Sequelize.where(Sequelize.col(`somdd_serial`), {
                        [Op.eq]: serial
                    })
                ]
            }
        })

        return result;
    }

    updateSerialOpname = async (somddOid, transaction) => {
        await SomddDet.update({
            somdd_qty_real: 1,
            somdd_updated_by: 'system',
            somdd_updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                somdd_oid: somddOid
            },
            transaction
        })
    }

    deleteSerialOpname = async (somddOid, transaction) => {
        await SomddDet.destroy({
            where: {
                somdd_oid: somddOid
            },
            transaction,
            logging: (sqlCommand) => {
                let realSql = sqlCommand.split(': ')[1];

                Query.delete(realSql);
            }
        })
    }
}

module.exports = new OpnameService();
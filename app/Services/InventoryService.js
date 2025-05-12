const {
    LocMstr,
    PtMstr, EnMstr,
    LocsMstr, InvcdDet, 
    InvcdhHist, Sequelize,
} = require('../../models');
const moment = require('moment');
const {Op} = require('sequelize');
const {v4: uuidV4} = require('uuid');

class InventoryService {
    getLocName = async (search) => {
        let result = await LocMstr.findAll({
            attributes: ['loc_id', 'loc_desc'],
            where: {
                loc_desc: {
                    [Op.iLike]: `%${search}%`
                }
            }
        });

        return result;
    }

    getSerialByOid = async (invcdOid) => {
        let result = await InvcdDet.findOne({
            attributes: [
                'invcd_dom_id',
                'invcd_en_id',
                'invcd_pt_id',
                'invcd_loc_id',
                'invcd_locs_id',
                'invcd_qrbarcode',
            ],
            where: {
                invcd_oid: invcdOid
            }
        })

        return result;
    } 

    destroySerial = async (invcdOid, transaction) => {
        await InvcdDet.destroy({
            where: {
                invcd_oid: invcdOid,
            },
            transaction
        })
    }

    createHistory = async (dataHistory, transaction) => {
        await InvcdhHist.bulkCreate(dataHistory, {
            transaction
        })
    }

    getHistorySerial = async () => {
        let result = await InvcdhHist.findAll({
            attributes: [
                [Sequelize.col(`"location_from"."loc_desc"`), 'origin_location'],
                [Sequelize.col(`"location_to"."loc_desc"`), 'destination_location'],
                [Sequelize.literal(`"sublocation_from"."locs_name"`), 'origin_sublocation'],
                [Sequelize.literal(`"sublocation_to"."locs_name"`), 'destination_sublocation'],
                ['invcdh_pt_id', 'product_id'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                ['invcdh_qrbarcode', 'serial'],
                ['invcdh_status', 'status'],
                ['invcdh_remarks', 'remark'],
                ['invcdh_created_by', 'created_by'],
                ['invcdh_created_date', 'created_at']
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }, {
                    model: EnMstr,
                    as: 'entity',
                    attributes: [],
                }, {
                    model: LocMstr,
                    as: 'location_from',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location_to',
                    attributes: []
                }, {
                    model: LocsMstr,
                    as: 'sublocation_from',
                    attributes: []
                }, {
                    model: LocsMstr,
                    as: 'sublocation_to',
                    attributes: []
                }
            ],
            order: [
                ['invcdh_created_date', 'desc']
            ]
        })

        return result;
    }

    createSerialNumber = async (body, transaction) => {
        await InvcdDet.create({
            invcd_oid: uuidV4(),
            invcd_dom_id: 1,
            invcd_en_id: body.en_id,
            invcd_pt_id: body.pt_id,
            invcd_qty: 1,
            invcd_qrbarcode: body.qrbarcode,
            invcd_loc_id: body.loc_id,
            invcd_locs_id: body.locs_id,
            invcd_um: 9964,
            invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            invcd_add_by: 'system',
            invcd_date: moment().format('YYYY-MM-DD'),
            invcd_is_verified: 'Y',
            invcd_scanned_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        }, {
            transaction
        })
    }

    getSerialProduct = async (locsId) => {
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
                invcd_locs_id: locsId,
                invcd_qty: 1,
                invcd_deleted_at: null,
                invcd_deleted_by: null
            },
            group: [
                Sequelize.col(`"product"."pt_id"`),
                Sequelize.col(`"product"."pt_code"`),
                Sequelize.col(`"product"."pt_desc1"`),
                Sequelize.col(`invcd_deleted_at`),
                Sequelize.col(`invcd_deleted_by`),
            ],
        })

        return result;
    }

    countSerialSublocation = async (locsId) => {
        let result = await InvcdDet.count({
            where: {
                invcd_locs_id: locsId,
                invcd_qty: 1,
                invcd_deleted_at: null,
                invcd_deleted_by: null
            }
        })

        return result;
    }

    getSerialSublocation = async (subLocId) => {
        let result = await InvcdDet.findAndCountAll({
            attributes: [
                'invcd_oid',
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                ['invcd_qrbarcode', 'uniq'],
                [Sequelize.col(`"sublocation"."locs_name"`), 'sublocation'],
                [Sequelize.literal(`CAST(invcd_qty AS INTEGER)`), 'qty'],
                [Sequelize.literal('CASE WHEN invcd_upd_date IS NOT NULL THEN invcd_upd_date ELSE invcd_add_date END'), 'created_at'],
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
                invcd_locs_id: subLocId,
                invcd_qty: 1,
                invcd_deleted_by: null,
                invcd_deleted_at: null
            },
            order: [
                ['invcd_add_date', 'DESC']
            ]
        })

        return result;
    }

    getSerialPartnumber = async (subLocId, productId) => {
        let result = await InvcdDet.findAndCountAll({
            attributes: [
                'invcd_oid',
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                ['invcd_qrbarcode', 'uniq'],
                [Sequelize.col(`"sublocation"."locs_name"`), 'sublocation'],
                [Sequelize.literal(`CAST(invcd_qty AS INTEGER)`), 'qty'],
                [Sequelize.literal('CASE WHEN invcd_upd_date IS NOT NULL THEN invcd_upd_date ELSE invcd_add_date END'), 'created_at'],
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
                invcd_locs_id: subLocId,
                invcd_pt_id: productId,
                invcd_qty: 1,
                invcd_deleted_at: null,
                invcd_deleted_by: null,
            },
            order: [
                ['invcd_add_date', 'DESC']
            ]
        })

        return result;
    }

    updateSerial = async (invcdOid, body, transaction) => {
        await InvcdDet.update({
            invcd_dom_id: 1,
            invcd_qty: 1,
            invcd_loc_id: body.location_id,
            invcd_locs_id: body.sublocation_id,
            invcd_qrbarcode: body.serial_number,
            invcd_is_verified: 'Y',
            invcd_um: 9964,
            invcd_upd_by: 'system',
            invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            invcd_upd_by: 'system',
            invcd_qty_old: Sequelize.literal(`"invcd_qty"`),
            invcd_scanned_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        }, {
            where: {
                invcd_oid: invcdOid
            },
            transaction
        })
    }

    getDataInventory = async (searchLocation, searchProduct) => {
        let result = await InvcdDet.findAll({
            attributes: [
                [Sequelize.col(`"product"."pt_id"`), 'product_id'],
                [Sequelize.col(`"location"."loc_id"`), 'location_id'],
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"location"."loc_desc"`), 'location_name'],
                [Sequelize.col(`"sublocation"."locs_name"`), 'sublocation_name'],
                [Sequelize.literal(`CAST(SUM(invcd_qty) AS INTEGER)`), 'total_qty']
            ],
            include: [
                {
                    model: LocMstr,
                    as: 'location',
                    attributes: []
                }, {
                    right: true,
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }, {
                    model: LocsMstr,
                    as: 'sublocation',
                    attributes: []
                }
            ],
            where: [
                Sequelize.where(Sequelize.col(`"location"."loc_desc"`), {
                    [Op.iLike]: `%${searchLocation}%`,
                }),
                Sequelize.where(Sequelize.col(`"product"."pt_desc1"`), {
                    [Op.iLike]: `%${searchProduct}%`,
                }),
                Sequelize.where(Sequelize.col(`"invcd_locs_id"`), {
                    [Op.not]: null,
                }),
                Sequelize.where(Sequelize.col(`"invcd_is_verified"`), {
                    [Op.eq]: `Y`,
                }),
                Sequelize.where(Sequelize.col(`"invcd_deleted_at"`), {
                    [Op.eq]: null,
                }),
                Sequelize.where(Sequelize.col(`"invcd_deleted_by"`), {
                    [Op.eq]: null,
                })
            ],
            order: [
                ['total_qty', 'DESC']
            ],
            group: [
                Sequelize.col(`"product"."pt_id"`),
                Sequelize.col(`"product"."pt_code"`),
                Sequelize.col(`"location"."loc_id"`),
                Sequelize.col(`"product"."pt_desc1"`),
                Sequelize.col(`"location"."loc_desc"`),
                Sequelize.col(`"sublocation"."locs_name"`),
                Sequelize.col(`invcd_deleted_at`),
                Sequelize.col(`invcd_deleted_by`),
            ],
            logging: (sqlCommand) => {
                console.info(sqlCommand)
            }
        })

        return result;
    }

    findSerialNumberByProductCode = async (serialNumber, productCode, transaction) => {
        let result = await InvcdDet.findOne({
            attributes: [
                'invcd_oid',
                [Sequelize.col('"product"."pt_desc1"'), 'product_name'],
                [Sequelize.col('"product"."pt_code"'), 'product_code'],
                'invcd_locs_id',
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
                        invcd_qrbarcode: serialNumber,
                        invcd_deleted_at: null,
                        invcd_deleted_by: null
                    }, {
                        [Op.and]: [
                            Sequelize.where(Sequelize.col('invcd_alias_qrbarcode'), {
                                [Op.eq]: serialNumber
                            }),
                            Sequelize.where(Sequelize.col(`"product"."pt_code"`), {
                                [Op.eq]: productCode
                            }),
                            Sequelize.where(Sequelize.col('invcd_deleted_at'), {
                                [Op.eq]: null
                            }),
                            Sequelize.where(Sequelize.col('invcd_deleted_by'), {
                                [Op.eq]: null
                            }),
                        ]
                    }
                ]
            },
            transaction
        })

        return result;
    }

    findSerialNumber = async (serialNumber, transaction) => {
        let result = await InvcdDet.findOne({
            attributes: [
                'invcd_oid',
                'invcd_dom_id',
                'invcd_en_id',
                'invcd_pt_id',
                'invcd_loc_id',
                'invcd_locs_id',
                [Sequelize.col('"product"."pt_desc1"'), 'product_name'],
                [Sequelize.col('"product"."pt_code"'), 'product_code'],
                ['invcd_qrbarcode', 'uniq'],
                ['invcd_alias_qrbarcode', 'alias_uniq'],
                [Sequelize.literal('CAST(invcd_qty AS INTEGER)'), 'qty'],
                ['invcd_en_id', 'entity_id'],
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
                ],
                invcd_deleted_at: null,
                invcd_deleted_by: null
            },
            order: [['invcd_pt_id', 'ASC']],
            transaction
        })

        return result;
    }

    findRegisteredSerialNumber = async (serialNumber, transaction) => {
        let result = await InvcdDet.findOne({
            attributes: [
                'invcd_oid',
                'invcd_dom_id',
                'invcd_en_id',
                'invcd_pt_id',
                'invcd_loc_id',
                'invcd_locs_id',
                [Sequelize.col('"product"."pt_desc1"'), 'product_name'],
                [Sequelize.col('"product"."pt_code"'), 'product_code'],
                ['invcd_qrbarcode', 'uniq'],
                ['invcd_alias_qrbarcode', 'alias_uniq'],
                [Sequelize.literal('CAST(invcd_qty AS INTEGER)'), 'qty'],
                ['invcd_en_id', 'entity_id'],
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }
            ],
            where: {
                invcd_deleted_at: null,
                invcd_deleted_by: null,
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

    moveSerial = async (invcdOid, locsId, transaction) => {
        await InvcdDet.update({
            invcd_locs_id: locsId,
            invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            invcd_upd_by: 'system'
        }, {
            where: {
                invcd_oid: {
                    [Op.in]: invcdOid
                }
            },
            transaction
        })
    }

    bookSerial = async (invcdOid, soOid) => {
        await InvcdDet.update({
            invcd_is_booked: 1,
            invcd_transaction_oid: soOid
        }, {
            where: {
                invcd_oid: invcdOid
            }
        })
    }

    releaseSerial = async (sodsOid, transaction) => {
        await InvcdDet.update({
            invcd_is_booked: 0,
            invcd_transaction_oid: null
        }, {
            where: {
                invcd_qrbarcode: {
                    [Op.eq]: Sequelize.literal(`(SELECT sods_serial FROM public.sods_serial WHERE sods_oid = '${sodsOid}')`)
                }
            },
            transaction
        })
    }

    getProductAndSerialBySublocation = async (locsId) => {
        let result = await PtMstr.findAll({
            attributes: [
                ['pt_id', 'product_id'],
                ['pt_code', 'product_code'],
                ['pt_desc1', 'product_name']
            ],
            include: [
                {
                    model: InvcdDet,
                    as: 'data_serial',
                    attributes: [
                        'invcd_oid',
                        ['invcd_qrbarcode', 'uniq'],
                        [Sequelize.literal(`"data_serial->sublocation"."locs_name"`), 'subloc_name'],
                        [Sequelize.literal('CAST(invcd_qty AS INTEGER)'), 'qty'],
                    ],
                    include: [
                        {
                            model: LocsMstr,
                            as: 'sublocation',
                            attributes: []
                        }
                    ],
                    where: {
                        invcd_qty: 1,
                        invcd_locs_id: locsId,
                        invcd_qrbarcode: {
                            [Op.not]: null
                        }
                    }
                }
            ],
            where: {
                pt_id: {
                    [Op.in]: Sequelize.literal(`(SELECT invcd_pt_id FROM public.invcd_det WHERE invcd_locs_id = :locs_id AND invcd_qty = 1 AND invcd_qrbarcode IS NOT NULL)`)
                }
            },
            replacements: {
                locs_id: locsId
            }
        })

        return result;
    }

    findSublocation = async (locsId) => {
        let result = await LocsMstr.findOne({
            attributes: [
                ['locs_id', 'sublocation_id'],
                ['locs_loc_id', 'location_id']
            ],
            where: {
                locs_id: locsId
            }
        })

        return result;
    }

    getPartnumberBySerial = async (serialNumber) => {
        let result = await InvcdDet.findAll({
            attributes: [
                'invcd_qrbarcode',
                'invcd_alias_qrbarcode',
                [Sequelize.col(`"product"."pt_code"`), 'pt_code']
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
            order: [
                ['invcd_qrbarcode', 'ASC']
            ]
        })

        return result;
    }

    scanoutSerial = async (invcdOid, transactionOid, transaction) => {
        await InvcdDet.update({
            invcd_qty: 0,
            invcd_upd_by: 'system',
            invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            invcd_upd_by: 'system',
            invcd_qty_old: Sequelize.literal(`"invcd_qty"`),
            invcd_scanned_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            invcd_is_booked: 1,
            invcd_transaction_oid: transactionOid
        }, {
            where: {
                invcd_oid: invcdOid
            },
            transaction
        })
    }

    getScannedOutSerial = async (transactionOid) => {
        let result = await InvcdDet.findAll({
            attributes: [
                'invcd_oid',
                'invcd_qrbarcode',
                'invcd_alias_qrbarcode',
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.col(`"location"."loc_desc"`), 'location_name'],
                [Sequelize.col(`"sublocation"."locs_name"`), 'sublocation_name'],
                ['invcd_transaction_oid', 'transaction_oid'],
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
                }, {
                    model: LocsMstr,
                    as: 'sublocation',
                    attributes: []
                }
            ],
            where: {
                invcd_transaction_oid: transactionOid
            }
        })

        return result;
    }

    newReleaseSerial = async (invcdQrBarcode, transaction) => {
        await InvcdDet.update({
            invcd_qty: 1,
            invcd_is_booked: 0,
            invcd_transaction_oid: null
        }, {
            where: {
                invcd_qrbarcode: invcdQrBarcode
            },
            transaction
        })
    }
}

module.exports = new InventoryService();
const {
    EnMstr, SiMstr,
    PtnrMstr, PtMstr, 
    SodDet, Sequelize,
    LocMstr, CodeMstr,
    SoMstr, SoShipdsSerial,
    TransStatus, SodsSerial,
} = require('../../models');
const {v4: uuidv4} = require("uuid");
const moment = require('moment');
const {Op} = require('sequelize');

class SalesOrderService {
    getHeaderSalesOrder = async (salesOrderCode, buyerName, salesName, status, year) => {
        let result = await SoMstr.findAll({
            attributes: [
                'so_oid',
                'so_code',
                [Sequelize.col(`"buyer"."ptnr_name"`), 'partner_name'],
                [Sequelize.col(`"sales"."ptnr_name"`), 'sales_person'],
                ['so_trans_id', 'status_code'],
                [Sequelize.col(`"status_so"."trans_desc"`), 'status'],
                ['so_add_date', 'created_at'],
            ],
            include: [
                {
                    model: PtnrMstr,
                    as: 'buyer',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'sales',
                    attributes: []
                }, {
                    model: TransStatus,
                    as: 'status_so',
                    attributes: []
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col(`"buyer"."ptnr_name"`), {
                        [Op.iLike]: `%${buyerName}%`
                    }),
                    Sequelize.where(Sequelize.col(`"sales"."ptnr_name"`), {
                        [Op.iLike]: `%${salesName}%`
                    }),
                    Sequelize.where(Sequelize.col(`so_code`), {
                        [Op.iLike]: `%${salesOrderCode}`
                    }),
                    Sequelize.where(Sequelize.col(`so_trans_id`), {
                        [Op.iLike]: `%${status}%`
                    }),
                    Sequelize.where(Sequelize.literal(`year(so_add_date)`), {
                        [Op.eq]: year
                    }),
                ]
            },
            order: [
                ['so_trans_id', 'DESC'],
                ['created_at', 'DESC'],
            ]
        });

        return result;
    }

    getDetailSalesOrder = async (salesOrderCode) => {
        let result = await SoMstr.findAll({
            attributes: [
                'so_oid',
                'so_sq_ref_oid',
                ['so_code', 'sales_order_code'],
                ['so_sq_ref_code', 'sales_quotation_code'],
                [Sequelize.literal(`"buyer"."ptnr_name"`), 'sold_to'],
                ['so_date', 'date'],
                ['so_booking', 'book'],
                ['so_cons', 'consigment'],
                ['so_trans_id', 'trans_id'],
                [Sequelize.literal(`"status_so"."trans_desc"`), 'status'],
                ['so_alocated', 'preorder'],
                ['so_add_by', 'created_by'],
                ['so_add_date', 'created_date']
            ],
            include: [
                {
                    model: TransStatus,
                    as: 'status_so',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'buyer',
                    attributes: []
                }, {
                    model: SodDet,
                    as: 'detail_sales_order',
                    attributes: [
                        'sod_oid',
                        'sod_sqd_oid',
                        ['sod_loc_id', 'location_id'],
                        ['sod_pt_id', 'product_id'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`), 'product_name'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`), 'product_code'],
                        [Sequelize.literal(`CAST(sod_qty AS INTEGER)`), 'qty_open'],
                        [Sequelize.literal(`CASE WHEN SUM("detail_sales_order->singular_serial_sales_order"."sods_qty") IS NULL THEN 0 ELSE SUM("detail_sales_order->singular_serial_sales_order"."sods_qty") END`), 'qty_scanned']
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }, {
                            model: SodsSerial,
                            as: 'singular_serial_sales_order',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                so_code: salesOrderCode,
                // so_trans_id: 'W'
            },
            group: [
                'so_oid',
                'so_sq_ref_oid',
                'sales_order_code',
                'sales_quotation_code',
                'sold_to',
                'sod_oid',
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`),
                Sequelize.literal(`"status_so"."trans_desc"`)
            ],
            subQuery: false
        })

        return result[0];
    }

    checkDetailSalesOrder = async (so_oid, product_code) => {
        let result = await SodDet.findOne({
            attributes: ['sod_pt_id'],
            include: [
                {
                    model: PtMstr,
                    as: 'detail_product',
                    attributes: []
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col(`"sod_so_oid"`), {
                        [Op.eq]: so_oid
                    }),
                    Sequelize.where(Sequelize.col(`"detail_product"."pt_code"`), {
                        [Op.eq]: product_code
                    })
                ]
            },
        });

        return result;
    }

    checkSerialSalesOrder = async (sod_oid, serial) => {
        let result = await SodsSerial.findOne({
            attributes: ['sods_oid', 'sods_qty', 'sods_serial'],
            where: {
                sods_sod_oid: sod_oid,
                sods_serial: serial
            },
        })

        return result;
    }

    countSerialSalesOrder = async (sod_oid) => {
        let result = await SodsSerial.count({
            where: {
                sods_sod_oid: sod_oid
            },
        })

        return result;
    }

    findDetailSalesOrder = async (sodOid) => {
        let {dataValues} = await SodDet.findOne({
            attributes: [
                'sod_qty',
            ],
            where: {
                sod_oid: sodOid
            }
        })

        return dataValues;
    }

    insertSerialSalesOrder = async (body, dataSerial, username, transaction) => {
        let sequence = await this.totalSerialBySodOid(body.sod_oid);

        let result = await SodsSerial.create({
            sods_oid: uuidv4(),
            sods_sod_oid: body.sod_oid,
            sods_qty: parseInt(dataSerial.qty),
            sods_loc_id: body.location_id,
            sods_si_id: 992,
            sods_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            sods_serial: body.serial,
            sods_seq: sequence,
            sods_add_by: username,
            sods_pt_id: dataSerial.invcd_pt_id,
            sods_locs_id: dataSerial.invcd_locs_id
        }, {
            transaction,
        })

        return result;
    }

    totalSerialBySodOid = async (sod_oid, transaction) => {
        let result = await SodsSerial.count({
            where: {
                sods_sod_oid: sod_oid
            },
            transaction
        })

        return result + 1;
    }

    getSerialProductSalesOrder = async (sodOid) => {
        let result = await SodDet.findOne({
            attributes: [
                [Sequelize.col(`"detail_product"."pt_id"`), 'product_id'],
                [Sequelize.col(`"detail_product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"detail_product"."pt_code"`), 'product_code'],
                [Sequelize.col(`"header_sales_order"."so_code"`), 'salesorder_code']
            ],
            include: [
                {
                    model: SoMstr,
                    as: 'header_sales_order',
                    attributes: []
                }, {
                    model: PtMstr,
                    as: 'detail_product',
                    attributes: []
                }, {
                    model: SodsSerial,
                    as: 'serial_sales_order',
                    attributes: [
                        'sods_oid',
                        ['sods_serial', 'serial']
                    ]
                }
            ],
            subQuery: false,
            where: {
                sod_oid: sodOid
            },
        })

        return result;
    }

    deleteSerialShipment = async (sodsOid, transaction) => {
        await SodsSerial.destroy({
            where: {
                sods_oid: sodsOid
            },
            transaction
        })
    }

    getSalesOrderOid = async (sodOid) => {
        let result = await SodDet.findOne({
            attributes: ['sod_so_oid'],
            where: {
                sod_oid: sodOid
            }
        })

        return result;
    }

    findDataHeaderSalesOrder = async (soOid) => {
        let result = await SoMstr.findOne({
            attributes: ['so_oid', 'so_code'],
            where: {
                so_oid: soOid
            }
        })

        return result;
    }

    findHeaderSOBySerial = async (sodsOid) => {
        let result = await SoMstr.findOne({
            attributes: ['so_oid', 'so_code', 'so_trans_id'],
            where: {
                so_oid: {
                    [Op.eq]: Sequelize.literal(`( SELECT sod_so_oid FROM public.sod_det WHERE sod_oid = ( SELECT sods_sod_oid FROM public.sods_serial WHERE sods_oid = :sods_oid ) )`)
                }
            },
            replacements: {
                sods_oid: sodsOid
            }
        });

        return result;
    }

    retrieveSalesOrderNumber = async ( entityId, search, startDate, endDate ) => {
        let result = await SoMstr.findAll({
            attributes: [
                'so_oid',
                [Sequelize.col(`entity_relation.en_desc`), 'entity'],
                ['so_code', 'so_number'],
                'so_date',
                [Sequelize.col(`buyer.ptnr_name`), 'customer']
            ],
            include: [
                {
                    model: EnMstr,
                    as: 'entity_relation',
                    attributes: []
                }, {
                    model: PtnrMstr,
                    as: 'buyer',
                    attributes: []
                }
            ],
            where: [
                Sequelize.where(Sequelize.col(`so_en_id`), {
                    [Op.eq]: entityId
                }),
                Sequelize.where(Sequelize.col(`so_code`), {
                    [Op.iLike]: `%${search}%`
                }),
                Sequelize.where(Sequelize.literal(`DATE(so_add_date)`), {
                    [Op.between]: [startDate, endDate]
                })
            ],
            order: [
                ['so_add_date', 'DESC']
            ]
        });

        return result;
    }

    retrieveSalesOrderForShipment = async ( salesOrderOid ) => {
        let result = await SoMstr.findOne({
            attributes: [
                'so_oid',
                ['so_code', 'so_number'],
            ],
            include: [
                {
                    model: SodDet,
                    as: 'detail_sales_order',
                    attributes: [
                        'sod_oid',
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_id"`), 'pt_id'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`), 'partnumber'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`), 'description1'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc2"`), 'description2'],
                        [Sequelize.literal('CASE WHEN sod_serial IS NOT NULL THEN TRUE ELSE FALSE END'), 'lot_or_serial'],
                        [Sequelize.literal(`CASE WHEN COUNT("detail_sales_order->singular_serial_sales_order"."sods_oid") = 0 THEN 'N' ELSE 'Y' END`), 'has_unique'],
                        [Sequelize.literal(`"detail_sales_order->site_relation"."si_desc"`), 'site'],
                        [Sequelize.literal(`"detail_sales_order->location_relation"."loc_desc"`), 'location'],
                        [Sequelize.literal('ROUND(sod_qty_open, 2)'), 'qty_open'],
                        [Sequelize.literal('ROUND(sod_qty_booked, 2)'), 'qty_booked'],
                        [Sequelize.literal(`ROUND(sod_qty_allocated, 2)`), 'qty_allocated'],
                        [Sequelize.literal(`COUNT("detail_sales_order->singular_serial_sales_order"."sods_oid")`), 'qty_shipment'],
                        [Sequelize.literal(`"detail_sales_order->unitmeasure_relation"."code_name"`), 'um'],
                        ['sod_um_conv', 'um_conv'],
                        [Sequelize.literal('ROUND(sod_qty_real, 2)'), 'qty_real'],
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }, {
                            model: SodsSerial,
                            as: 'singular_serial_sales_order',
                            attributes: []
                        }, {
                            model: SiMstr,
                            as: 'site_relation',
                            attributes: []
                        }, {
                            model: LocMstr,
                            as: 'location_relation',
                            attributes: []
                        }, {
                            model: CodeMstr,
                            as: 'unitmeasure_relation',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                so_oid: salesOrderOid
            },
            group: [
                'so_oid',
                Sequelize.literal(`"detail_sales_order"."sod_oid"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_id"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc2"`),
                Sequelize.literal(`"detail_sales_order->site_relation"."si_desc"`),
                Sequelize.literal(`"detail_sales_order->location_relation"."loc_desc"`),
                Sequelize.literal(`"detail_sales_order->unitmeasure_relation"."code_name"`),
            ]
        });

        return result;
    }

    retrieveSerialNumberSalesOrder = async ( salesOrderOid ) => {
        let result = await SodsSerial.findAll({
            attributes: [
                'sods_oid',
                'sods_sod_oid',
                [Sequelize.col(`detail_so.sod_pt_id`), 'product_id'],
                [Sequelize.col(`detail_so->detail_product.pt_code`), 'partnumber'],
                [Sequelize.col(`detail_so->detail_product.pt_desc1`), 'description1'],
                [Sequelize.col(`detail_so->detail_product.pt_desc2`), 'description2'],
                [Sequelize.col(`detail_so->location_relation.loc_desc`), 'location'],
                ['sods_qty', 'qty'],
                ['sods_serial', 'qrbarcode']
            ],
            include: [
                {
                    model: SodDet,
                    as: 'detail_so',
                    attributes: [],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }, {
                            model: LocMstr,
                            as: 'location_relation',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                sods_sod_oid: {
                    [Op.in]: Sequelize.literal(`(SELECT sod_oid FROM public.sod_det WHERE sod_so_oid = (SELECT so_oid FROM public.so_mstr WHERE so_oid = :salesorder_oid))`)
                }
            },
            replacements: {
                salesorder_oid: salesOrderOid
            }
        });

        return result;
    }
}

module.exports = new SalesOrderService();
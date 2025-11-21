const { Op } = require('sequelize');
const {
    CodeMstr,
    SiMstr, CuMstr,
    LocMstr, SodDet, 
    PtMstr, PtnrMstr, 
    Sequelize, EnMstr,
    SoShipMstr, SoMstr, 
    SoShipdDet, SoShipdsSerial, 
} = require('../../models');
const moment = require('moment');

class ShipmentService {
    retrieveHeaderShipment = async ( params ) => {
        let result = await SoShipMstr.findAll({
            attributes: [
                'soship_oid',
                [Sequelize.col(`entity_relation.en_desc`), 'entity'],
                [Sequelize.col(`sales_order_master.so_code`), 'so_number'],
                [Sequelize.col(`sales_order_master->buyer.ptnr_name`), 'sold_to'],
                [Sequelize.col(`sales_order_master.so_booking`), 'booking'],
                [Sequelize.col(`sales_order_master.so_cons`), 'consignment'],
                [Sequelize.col(`sales_order_master.so_alocated`), 'preorder'],
                ['soship_code', 'shipment_number'],
                ['soship_date', 'date'],
                [Sequelize.col(`site_relation.si_desc`), 'site'],
                [Sequelize.col(`currency_relation.cu_name`), 'currency'],
                [Sequelize.literal('ROUND(soship_exc_rate, 2)'), 'exchange_rate'],
                [`soship_remarks`, 'remarks'],
                ['soship_add_by', 'user_create'],
                ['soship_add_date', 'date_create'],
                ['soship_upd_by', 'user_update'],
                ['soship_upd_date', 'date_update'],
            ],
            include: [
                {
                    model: EnMstr,
                    as: 'entity_relation',
                    attributes: []
                }, {
                    model: SoMstr,
                    as: 'sales_order_master',
                    attributes: [],
                    include: [
                        {
                            model: PtnrMstr,
                            as: 'buyer',
                            attributes: []
                        }
                    ]
                }, {
                    model: SiMstr,
                    as: 'site_relation',
                    attributes: []
                }, {
                    model: CuMstr,
                    as: 'currency_relation',
                    attributes: []
                }
            ],
            where: [
                Sequelize.where(Sequelize.literal(`DATE(soship_add_date)`), {
                    [Op.between]: [params.conditions.start_date, params.conditions.end_date]
                }),
                Sequelize.where(Sequelize.col(`soship_code`), {
                    [Op.iLike]: `%${params.conditions.shipment_code}%`
                })
            ],
            order: [
                [`soship_add_date`, params.sort.date_sort]
            ],
        });

        return result;
    }

    retrieveDetailShipmentByOid = async ( shipmentOid ) => {
        let result = await SoShipdDet.findAll({
            attributes: [
                'soshipd_oid',
                [Sequelize.col(`detail_sales_order->detail_product.pt_code`), 'partnumber'],
                [Sequelize.col(`detail_sales_order->detail_product.pt_desc1`), 'description1'],
                [Sequelize.col(`detail_sales_order->detail_product.pt_desc2`), 'description2'],
                [Sequelize.col(`detail_sales_order->site_relation.si_desc`), 'site'],
                [Sequelize.col(`detail_sales_order->location_relation.loc_desc`), 'location'],
                [Sequelize.literal('soshipd_qty::INTEGER * -1'), 'qty_shipment'],
                [Sequelize.literal(`soshipd_qty_inv::INTEGER`), 'qty_invoice'],
                [Sequelize.col(`unitmeasure_relation.code_desc`), 'um'],
                [Sequelize.literal(`soshipd_um_conv::INTEGER`), 'um_conversion'],
                [Sequelize.literal(`soshipd_qty_real::INTEGER * -1`), 'qty_real'],
            ],
            include: [
                {
                    model: SodDet,
                    as: 'detail_sales_order',
                    attributes: [],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }, {
                            model: SiMstr,
                            as: 'site_relation',
                            attributes: []
                        }, {
                            model: LocMstr,
                            as: 'location_relation',
                            attributes: []
                        }
                    ]
                }, {
                    model: CodeMstr,
                    as: 'unitmeasure_relation',
                    attributes: []
                }
            ],
            where: [
                Sequelize.where(Sequelize.col(`soshipd_soship_oid`), {
                    [Op.eq]: shipmentOid
                })
            ],
        });

        return result;
    }

    retrieveSerialShipmentByOid = async ( shipmentOid ) => {
        let result = await SoShipdsSerial.findAll({
            attributes: [
                'soshipds_soshipd_oid',
                [Sequelize.col(`shipment_detail_relation.soshipd_soship_oid`), 'soshipd_soship_oid'],
                [Sequelize.col(`shipment_detail_relation->detail_sales_order->detail_product.pt_code`), 'partnumber'],
                [Sequelize.col(`shipment_detail_relation->detail_sales_order->detail_product.pt_desc1`), 'description1'],
                [Sequelize.col(`shipment_detail_relation->detail_sales_order->detail_product.pt_desc2`), 'description2'],
                [Sequelize.col(`shipment_detail_relation->detail_sales_order->site_relation.si_desc`), 'site'],
                [Sequelize.literal(`soshipds_qty::INTEGER * -1`), 'qty'],
                [`soshipds_qrbarcode`, 'qrbarcode']
            ],
            include: [
                {
                    model: SoShipdDet,
                    as: 'shipment_detail_relation',
                    attributes: [],
                    include: [
                        {
                            model: SodDet,
                            as: 'detail_sales_order',
                            attributes: [],
                            include: [
                                {
                                    model: PtMstr,
                                    as: 'detail_product',
                                    attributes: []
                                }, {
                                    model: SiMstr,
                                    as: 'site_relation',
                                    attributes: []
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                soshipds_soshipd_oid: {
                    [Op.in]: Sequelize.literal(`(SELECT soshipd_oid FROM public.soshipd_det WHERE soshipd_soship_oid = :header_shipment_oid)`)
                }
            },
            replacements: {
                header_shipment_oid: shipmentOid
            }
        });

        return result;
    }

    getDetailShipment = async (shipmentCode) => {
        let result = await SoShipMstr.findAll({
            attributes: [
                'soship_oid', 
                ['soship_code', 'shipment_code'],
                [Sequelize.col(`"sales_order_master"."so_code"`), 'sales_order_code'],
                [Sequelize.col(`"sales_order_master->buyer"."ptnr_name"`), 'sold_to'],
                ['soship_date', 'date'],
                [Sequelize.col(`"sales_order_master"."so_booking"`), 'book'],
                [Sequelize.col(`"sales_order_master"."so_cons"`), 'consigment'],
                [Sequelize.col(`"sales_order_master"."so_alocated"`), 'preorder'],
                ['soship_add_by', 'created_by'],
                ['soship_add_date', 'created_date'],
            ],
            include: [
                {
                    model: SoMstr,
                    as: 'sales_order_master',
                    attributes: [],
                    include: [
                        {
                            model: PtnrMstr,
                            as: 'buyer',
                            attributes: []
                        }
                    ]
                }, {
                    model: SoShipdDet,
                    as: 'detail_soship',
                    attributes: [
                        'soshipd_oid',
                        'soshipd_sod_oid',
                        [Sequelize.literal(`"detail_soship->detail_sales_order"."sod_pt_id"`), 'product_id'],
                        [Sequelize.literal(`"detail_soship->detail_sales_order"."sod_loc_id"`), 'location_id'],
                        [Sequelize.literal(`"detail_soship->detail_sales_order->detail_product"."pt_desc1"`), 'product_name'],
                        [Sequelize.literal(`"detail_soship->detail_sales_order->detail_product"."pt_code"`), 'product_code'],
                        [Sequelize.literal(`CAST("detail_soship->detail_sales_order"."sod_qty" AS INTEGER)`), 'qty_needed'],
                    ],
                    include: [
                        {
                            model: SodDet,
                            as: 'detail_sales_order',
                            attributes: [],
                            include: [
                                {
                                    model: PtMstr,
                                    as: 'detail_product',
                                    attributes: []
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                soship_code: shipmentCode
            },
            subQuery: false
        })

        return result[0];
    }

    getDetailSerial = async (detailShipmentOid) => {
        let result = await SoShipdDet.findAll({
            attributes: [
                [Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`), 'product_name'],
                [Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`), 'product_code'],
            ],
            include: [
                {
                    model: SodDet,
                    as: 'detail_sales_order',
                    attributes: [],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }
                    ]
                }, {
                    model: SoShipdsSerial,
                    as: 'shipment_serial',
                    attributes: [
                        ['soshipds_qrbarcode', 'qrbarcode'],
                        [Sequelize.literal(`"shipment_serial->serial_location"."loc_desc"`), 'location']
                    ],
                    include: [
                        {
                            model: LocMstr,
                            as: 'serial_location',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                soshipd_oid: detailShipmentOid
            },
            subQuery: false
        });

        return result[0];
    }

    inputHeaderShipment = async ( bodyHeader, dataUser, transaction ) => {
        await SoShipMstr.create({
            soship_oid: bodyHeader.header_shipment_oid,
            soship_dom_id: bodyHeader.domain_id,
            soship_en_id: bodyHeader.entity_id,
            soship_add_by: dataUser.usernama,
            soship_add_date: Sequelize.literal(`CURRENT_TIMESTAMP`),
            soship_code: bodyHeader.shipment_code,
            soship_date: bodyHeader.shipment_date,
            soship_so_oid: bodyHeader.so_oid,
            soship_si_id: bodyHeader.site_id,
            soship_is_shipment: 'Y',
            soship_dt: Sequelize.literal(`CURRENT_TIMESTAMP`),
            soship_exc_rate: bodyHeader.exchange_rate,
            soship_cu_id: bodyHeader.currency_id,
            soship_booking: bodyHeader.booking,
            soship_cons: bodyHeader.consigment,
            soship_alocated: bodyHeader.alocated
        }, {
            transaction
        });
    }

    inputDetailShipment = async ( bodyDetail, transaction ) => {
        await SoShipdDet.bulkCreate(bodyDetail, {
            transaction
        });
    }

    inputSerialShipment = async ( bodySerial, transaction ) => {
        await SoShipdsSerial.bulkCreate(bodySerial, {
            transaction
        });
    }

    countHeaderShipmentMonthly = async () => {
        let startDate = moment().startOf('months').format('YYYY-MM-DD');
        let endDate = moment().endOf('months').format('YYYY-MM-DD');

        let result = await SoShipMstr.count({
            where: [
                Sequelize.where(Sequelize.literal(`DATE(soship_add_date)`), {
                    [Op.between]: [startDate, endDate]
                })
            ]
        });

        return result;
    }
}

module.exports = new ShipmentService();
const { 
    RiuMstr, RiudDet, 
    RiudsSerial, Sequelize,
    PtMstr, LocMstr, InvcdDet
} = require('../../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class InventoryReceiptService {
    findAllHeaderInventoryReceipt = async (inventoryReceiptCode, startDate, endDate) => {
        let result = await RiuMstr.findAll({
            attributes: [
                'riu_oid',
                ['riu_type2', 'riu_code'],
                'riu_date',
                ['riu_type', 'type'],
                ['riu_remarks', 'remakrs'],
                ['riu_add_by', 'created_by'],
                ['riu_add_date', 'created_date']
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col(`riu_type2`), {
                        [Op.iLike]: `%${inventoryReceiptCode}`
                    }),
                    Sequelize.where(Sequelize.literal(`DATE(riu_add_date)`), {
                        [Op.between]: [startDate, endDate]
                    })
                ]
            },
            order: [
                ['riu_add_date', 'DESC']
            ]
        })

        return result;
    }

    findHeaderInventoryReceipt = async (inventoryReceiptOid) => {
        let result = await RiuMstr.findOne({
            attributes: [
                'riu_oid',
                ['riu_type2', 'riu_code'],
                ['riu_add_by', 'created_by'],
                ['riu_add_date', 'created_date'],
                ['riu_date', 'date'],
                ['riu_type', 'type'],
                ['riu_remarks', 'remarks']
            ],
            include: [
                {
                    model: RiudDet,
                    as: 'detail_receive_inventory',
                    attributes: [
                        'riud_oid',
                        ['riud_pt_id', 'product_id'],
                        [Sequelize.literal(`"detail_receive_inventory->detail_product"."pt_code"`), 'product_code'],
                        [Sequelize.literal(`"detail_receive_inventory->detail_product"."pt_desc1"`), 'product_name'],
                        [Sequelize.literal(`"detail_receive_inventory->detail_data_location"."loc_desc"`), 'location_name'],
                        [Sequelize.literal('CAST(riud_qty_real AS BIGINT)'), 'qty_real'],
                        [Sequelize.literal(`COUNT("detail_receive_inventory->singular_serial_inventory_receipt"."riuds_oid")`), 'qty_checked']
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }, {
                            model: LocMstr,
                            as: 'detail_data_location',
                            attributes: []
                        }, {
                            model: RiudsSerial,
                            as: 'singular_serial_inventory_receipt',
                            attributes: []
                        }, {
                            model: RiudsSerial,
                            as: 'serial_inventory_receipt',
                            attributes: ['riuds_oid', ['riuds_qrbarcode', 'qrbarcode'], ['riuds_dt', 'created_at']]
                        }
                    ]
                }
            ],
            where: {
                riu_oid: inventoryReceiptOid
            },
            group: [
                'riu_oid',
                'riu_code',
                'created_by',
                'created_date',
                'date',
                'type',
                'remarks',
                'riud_oid',
                Sequelize.literal(`"detail_receive_inventory->detail_product"."pt_code"`),
                Sequelize.literal(`"detail_receive_inventory->detail_product"."pt_desc1"`),
                Sequelize.literal(`"detail_receive_inventory->detail_data_location"."loc_desc"`),
                Sequelize.literal(`"detail_receive_inventory->serial_inventory_receipt"."riuds_oid"`),
                Sequelize.literal('CAST(riud_qty_real AS BIGINT)')
            ]
        });

        return result;
    }

    findDetailInventoryReceript = async (inventoryReceiptHeaderOid, productCode) => {
        const result = await RiudDet.findOne({
            attributes: [
                'riud_oid',
                ['riud_pt_id', 'product_id'],
                [Sequelize.literal(`"detail_product"."pt_desc1"`), 'product_name'],
                [Sequelize.literal(`"detail_product"."pt_code"`), 'product_code'],
                ['riud_loc_id', 'location_id'],
                [Sequelize.literal(`"detail_data_location"."loc_desc"`), 'location_name'],
                [Sequelize.literal('CAST(riud_qty_real AS INTEGER)'), 'qty_real'],
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'detail_product',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'detail_data_location',
                    attributes: []
                },
            ],
            where: {
                riud_riu_oid: inventoryReceiptHeaderOid,
                riud_pt_id: {
                    [Op.eq]: Sequelize.literal(`( SELECT pt_id FROM public.pt_mstr WHERE pt_code = :product_code )`)
                }
            },
            replacements: {
                product_code: productCode
            }
        })

        return result;
    }

    storeSerialInventoryReceipt = async (body, transaction) => {
        let result = await RiudsSerial.create({
            riuds_oid: uuidv4(),
            riuds_riud_oid: body.riud_oid,
            riuds_qty: 1,
            riuds_si_id: 992,
            riuds_loc_id: body.location_id,
            riuds_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            riuds_um: 9964,
            riuds_qrbarcode: body.unique,
            riuds_pt_id: body.product_id
        }, {
            transaction
        });

        return result;
    }

    getTotalUnique = async (riud_oid, productId) => {
        let result = await RiudsSerial.count({
            where: {
                riuds_riud_oid: riud_oid,
                riuds_pt_id: productId
            }
        });

        return result;
    }

    findUniqueInventoryReceipt = async (riu_oid, unique) => {
        let result = await RiudsSerial.findOne({
            attributes: ['riuds_pt_id', 'riuds_oid'],
            where: {
                riuds_riud_oid: {
                    [Op.in]: Sequelize.literal(`( SELECT riud_oid FROM public.riud_det WHERE riud_riu_oid = :riu_oid )`)
                },
                riuds_qrbarcode: unique
            },
            replacements: {riu_oid}
        })

        return result;
    }

    findSerialInventoryReceipt = async (riudsOid) => {
        let result = await RiudsSerial.findOne({
            attributes: [
                [Sequelize.literal(`"data_serial"."invcd_pt_id"`), 'product_id'],
                [Sequelize.literal(`"data_serial"."invcd_en_id"`), 'entity_id'],
                [Sequelize.literal(`"data_serial"."invcd_oid"`), 'invcd_oid'],
                [Sequelize.literal(`"data_serial"."invcd_loc_id"`), 'location_id'],
                [Sequelize.literal(`"data_serial"."invcd_locs_id"`), 'sublocation_id'],
                ['riuds_qrbarcode', 'qrbarcode'],
            ],
            include: [
                {
                    model: InvcdDet,
                    as: 'data_serial',
                    attributes: []
                }
            ],
            where: {
                riuds_oid: riudsOid
            }
        });

        return result;
    }

    deleteUnique = async (riudsOid, transaction) => {
        await RiudsSerial.destroy({
            where: {
                riuds_oid: riudsOid
            },
            transaction
        })
    }
}

module.exports = new InventoryReceiptService();
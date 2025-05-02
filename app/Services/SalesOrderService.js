const {
    PtnrMstr, PtMstr, 
    SodDet, Sequelize,
    SoMstr, SoShipdsSerial,
    TransStatus, SodsSerial,
} = require('../../models');
const {v4: uuidv4} = require("uuid");
const moment = require('moment');
const {Op} = require('sequelize');

class SalesOrderService {
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

    insertSerialSalesOrder = async (body, dataSerial, transaction) => {
        let sequence = await this.totalSerialBySodOid(body.sod_oid);

        let result = await SodsSerial.create({
            sods_oid: uuidv4(),
            sods_sod_oid: body.sod_oid,
            sods_qty: parseInt(dataSerial.qty),
            sods_loc_id: body.location_id,
            sods_si_id: 992,
            sods_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            sods_serial: body.serial,
            sods_seq: sequence
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
}

module.exports = new SalesOrderService();
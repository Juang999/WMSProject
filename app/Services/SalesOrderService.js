const {SoMstr, SodsSerial, PtnrMstr, PtMstr, SodDet, Sequelize} = require('../../models');
const {v4: uuidv4} = require("uuid");
const moment = require('moment');

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
                ['so_alocated', 'preorder'],
                ['so_add_by', 'created_by'],
                ['so_add_date', 'created_date']
            ],
            include: [
                {
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
                so_code: salesOrderCode
            },
            group: [
                'so_oid',
                'so_sq_ref_oid',
                'sales_order_code',
                'sales_quotation_code',
                'sold_to',
                'sod_oid',
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`),
                Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`)
            ],
            subQuery: false
        })

        return result[0];
    }

    checkSerialSalesOrder = async (sod_oid, serial) => {
        let result = await SodsSerial.findOne({
            attributes: ['sods_oid', 'sods_qty', 'sods_serial'],
            where: {
                sods_sod_oid: sod_oid,
                sods_serial: serial
            },
            logging: (sqlCommand) => {
                console.info(sqlCommand)
            }
        })

        return result;
    }

    insertSerialSalesOrder = async (body, dataSerial, transaction) => {
        let sequence = await this.totalSerialBySodOid(body.sod_oid);

        let result = await SodsSerial.create({
            sods_oid: uuidv4(),
            sods_sod_oid: body.sod_oid,
            sods_qty: parseInt(dataSerial.qty),
            sods_loc_id: body.location_id,
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
}

module.exports = new SalesOrderService();
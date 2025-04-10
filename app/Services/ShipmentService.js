const {SoShipMstr, SoMstr, SodDet, PtMstr, PtnrMstr, SoShipdDet, SoShipdsSerial, Sequelize} = require('../../models');

class ShipmentService {
    getDetailSerial = async (shipmentCode) => {
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
            subQuery: false,
            logging: (sqlCommand) => {
                console.info(sqlCommand)
            }
        })

        return result[0];
    }
}

module.exports = new ShipmentService();
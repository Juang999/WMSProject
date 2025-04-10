const {SoMstr, PtnrMstr, PtMstr, SodDet, Sequelize} = require('../../models');

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
                        [Sequelize.literal(`CAST(sod_qty AS INTEGER)`), 'qty_open']
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                so_code: salesOrderCode
            },
            subQuery: false
        })

        return result[0];
    }
}

module.exports = new SalesOrderService();
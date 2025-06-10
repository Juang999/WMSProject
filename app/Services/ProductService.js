const {PtMstr, InvcMstr, InvcdDet, EnMstr, PtCatMstr, Sequelize} = require('../../models');
const {Op, where} = require('sequelize');

class ProductService {
    findProductByPartnumber = async (partnumber) => {
        let result = await PtMstr.findOne({
            attributes: [
                'pt_en_id',
                'pt_id',
                ['pt_code', 'partnumber']
            ],
            where: {
                pt_code: partnumber
            }
        })

        return result;
    }

    findProductById = async (productId) => {
        let result = await PtMstr.findOne({
            attributes: [
                'pt_en_id',
                'pt_id',
                ['pt_code', 'partnumber']
            ],
            where: {
                pt_id: productId
            }
        })

        return result;
    }

    getSimpleDataProduct = async (entity_id, location_id, search) => {
        let locationIdClause = (location_id == null) ? {[Op.not]: null} 
                                            : {[Op.eq]: location_id};

        let result = await PtMstr.findAll({
            attributes: [
                'pt_id', 
                'pt_code', 
                'pt_desc1',
                [Sequelize.col(`"singular_inventory_control"."invc_loc_id"`), 'loc_id']
            ],
            include: [
                {
                    model: InvcMstr,
                    as: 'singular_inventory_control',
                    attributes: [],
                    where: {
                        invc_loc_id: locationIdClause
                    }
                }
            ],
            where: {
                pt_en_id: entity_id,
                pt_desc1: {
                    [Op.iLike]: `%${search}%`
                },
            }
        })

        return result;
    }

    findBulkPartnumber = async (bulkPartnumber) => {
        let result = await PtMstr.findAll({
            attributes: [
                ['pt_id', 'product_id'],
                ['pt_desc1', 'product_name'],
                ['pt_code', 'partnumber']
            ],
            where: {
                pt_code: {
                    [Op.in]: bulkPartnumber
                }
            }
        });

        return result;
    }

    getProductsQuantity = async (search) => {
        let result = await InvcdDet.findAll({
            attributes: [
                ['invcd_pt_id', 'product_id'],
                [Sequelize.col(`"product->data_entity"."en_desc"`), 'entity'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.literal(`CAST(SUM(invcd_qty) AS INTEGER)`), 'total_quantity']
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: [],
                    include: [
                        {
                            model: EnMstr,
                            as: 'data_entity',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.col('"product"."pt_code"'), {
                        [Op.iLike]: `%${search}%`
                    }),
                    Sequelize.where(Sequelize.col('"product"."pt_desc1"'), {
                        [Op.iLike]: `%${search}%`
                    })
                ]
            },
            group: ['product_id', 'entity', 'product_name', 'product_code'],
            order: [['total_quantity', 'DESC']],
        });

        return result;
    }
}

module.exports = new ProductService();
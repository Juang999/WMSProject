const {
    LocMstr, 
    Sequelize,
    PtMstr, InvcMstr, 
    InvcdDet, EnMstr, 
    PtCatMstr, PtsCatCat,
} = require('../../models');
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

    getProductsQuantity = async (productCode, productName, locationName, categooryName, subCategooryName) => {
        let result = await InvcdDet.findAll({
            attributes: [
                ['invcd_pt_id', 'product_id'],
                [Sequelize.col(`"product->data_entity"."en_desc"`), 'entity'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                // [Sequelize.literal(`CASE WHEN "product"."pt_cat_id" IS NOT NULL THEN "product->category"."ptcat_desc" ELSE '-' END`), 'category_name'],
                // [Sequelize.literal(`CASE WHEN "product"."pt_scat_id" IS NOT NULL THEN "product->subcategory"."ptscat_desc" ELSE '-' END`), 'subcategory_name'],
                // [Sequelize.literal(`EXTRACT(YEAR FROM "product"."pt_year")`), 'release_date'],
                [Sequelize.literal(`CAST(SUM(invcd_qty) AS INTEGER)`), 'total_quantity'],
                [Sequelize.col(`"location"."loc_desc"`), 'location_name'],
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
                        }, 
                        // {
                        //     model: PtCatMstr,
                        //     as: 'category',
                        //     attributes: []
                        // }, {
                        //     model: PtsCatCat,
                        //     as: 'subcategory',
                        //     attributes: []
                        // }
                    ]
                }, {
                    model: LocMstr,
                    as: 'location',
                    attributes: []
                }
            ],
            where: [
                Sequelize.where(Sequelize.col(`"product"."pt_code"`), {
                    [Op.iLike]: `%${productCode}%`
                }),
                Sequelize.where(Sequelize.col(`"product"."pt_desc1"`), {
                    [Op.iLike]: `%${productName}%`
                }),
                Sequelize.where(Sequelize.col(`"location"."loc_desc"`), {
                    [Op.iLike]: `%${locationName}%`
                }),
                // Sequelize.where(Sequelize.col(`"product->category"."ptcat_desc"`), {
                //     [Op.iLike]: `%${categooryName}%`
                // }),
                // Sequelize.where(Sequelize.col(`"product->subcategory"."ptscat_desc"`), {
                //     [Op.iLike]: `%${subCategooryName}%`
                // }),
                Sequelize.where(Sequelize.col(`"invcd_locs_id"`), {
                    [Op.not]: null
                }),
                Sequelize.where(Sequelize.col(`"invcd_qty"`), {
                    [Op.not]: 0
                }),
                Sequelize.where(Sequelize.col(`"invcd_is_verified"`), {
                    [Op.eq]: 'Y'
                }),
            ],
            group: ['product_id', 'entity', 'product_name', 'product_code', 
                // 'category_name', 'subcategory_name', 
                'location_name', 
                // 'release_date'
            ],
            order: [['product_code', 'ASC']],
        });

        return result;
    }
}

module.exports = new ProductService();
const {
    InvctTable,
    LocMstr, SiMstr,
    PtMstr, InvcMstr, 
    InvcdDet, EnMstr, 
    Sequelize, AreaMstr,
    PtCatMstr, PtsCatCat,
    PiMstr, PidDet, PiddDet,
} = require('../../models');
const {Op, where} = require('sequelize');
const models = require('../../modules/GetDesc/models');

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

    getProductsQuantity = async (productCode, productName, categooryName, subCategooryName, year) => {
        let whereClause = [
                Sequelize.where(Sequelize.col(`"product"."pt_code"`), {
                    [Op.iLike]: `%${productCode}%`
                }),
                Sequelize.where(Sequelize.col(`"product"."pt_desc1"`), {
                    [Op.iLike]: `%${productName}%`
                }),
                Sequelize.where(Sequelize.col(`"invcd_locs_id"`), {
                    [Op.not]: null
                }),
                Sequelize.where(Sequelize.col(`"invcd_loc_id"`), {
                    [Op.in]: [1000555, 2000556, 3000557, 1002718, 2002719, 3002720]
                }),
                Sequelize.where(Sequelize.col(`"invcd_qty"`), {
                    [Op.not]: 0
                }),
                Sequelize.where(Sequelize.col(`"invcd_is_verified"`), {
                    [Op.eq]: 'Y'
                }),
            ]

        if (categooryName != '') {
            whereClause.push(Sequelize.where(Sequelize.col(`"product->category"."ptcat_desc"`), {
                [Op.iLike]: `%${categooryName}%`
            }))
        }

        if (subCategooryName != '') {
            whereClause.push(Sequelize.where(Sequelize.col(`"product->subcategory"."ptscat_desc"`), {
                [Op.iLike]: `%${subCategooryName}%`
            }))
        }

        if (year != '') {
            whereClause.push(Sequelize.where(Sequelize.literal(`EXTRACT(YEAR FROM "product"."pt_year")`), {
                [Op.eq]: `${year}`
            }))
        }

        let result = await InvcdDet.findAll({
            attributes: [
                ['invcd_pt_id', 'product_id'],
                [Sequelize.col(`"product->data_entity"."en_desc"`), 'entity'],
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.literal(`CASE WHEN "product"."pt_cat_id" IS NOT NULL THEN "product->category"."ptcat_desc" ELSE '-' END`), 'category_name'],
                [Sequelize.literal(`CASE WHEN "product"."pt_scat_id" IS NOT NULL THEN "product->subcategory"."ptscat_desc" ELSE '-' END`), 'subcategory_name'],
                [Sequelize.literal(`EXTRACT(YEAR FROM "product"."pt_year")`), 'release_date'],
                [Sequelize.literal(`"product->singular_relation_pricelist->header_pricelist"."pi_desc"`), 'pricelist_name'],
                [Sequelize.literal(`"product->singular_relation_pricelist->singular_detail_pricelist"."pidd_price"`), "price"],
                [Sequelize.literal(`( SELECT CASE WHEN count(invcd_oid) != 0 THEN count(invcd_oid) ELSE 0 END FROM public.invcd_det WHERE invcd_pt_id = "InvcdDet"."invcd_pt_id" AND invcd_loc_id IN (1000555, 2000556, 3000557) AND invcd_scanned_at IS NOT NULL AND invcd_is_verified = 'Y' AND invcd_locs_id IS NOT NULL GROUP BY "InvcdDet"."invcd_pt_id" )`), 'total_incoming_regular'],
                [Sequelize.literal(`( SELECT CASE WHEN count(invcd_oid) != 0 THEN count(invcd_oid) ELSE 0 END FROM public.invcd_det WHERE invcd_pt_id = "InvcdDet"."invcd_pt_id" AND invcd_loc_id IN (1000555, 2000556, 3000557) AND invcd_qty = 1 AND invcd_qrbarcode IS NOT NULL AND invcd_is_verified = 'Y' AND invcd_locs_id IS NOT NULL GROUP BY "InvcdDet"."invcd_pt_id" )`), 'quantity_regular'],
                [Sequelize.literal(`( SELECT CASE WHEN count(invcd_oid) != 0 THEN count(invcd_oid) ELSE 0 END FROM public.invcd_det WHERE invcd_pt_id = "InvcdDet"."invcd_pt_id" AND invcd_loc_id IN (1000555, 2000556, 3000557) AND invcd_scanned_at IS NOT NULL AND invcd_is_verified = 'Y' AND invcd_locs_id IS NOT NULL AND invcd_qty = 0 GROUP BY "InvcdDet"."invcd_pt_id" )`), 'total_outgoing_regular'],
                [Sequelize.literal(`( SELECT CASE WHEN count(invcd_oid) != 0 THEN count(invcd_oid) ELSE 0 END FROM public.invcd_det WHERE invcd_pt_id = "InvcdDet"."invcd_pt_id" AND invcd_loc_id IN (1002718, 2002719, 3002720) AND invcd_scanned_at IS NOT NULL AND invcd_is_verified = 'Y' AND invcd_locs_id IS NOT NULL GROUP BY "InvcdDet"."invcd_pt_id" )`), 'total_incoming_pusat'],
                [Sequelize.literal(`( SELECT CASE WHEN count(invcd_oid) != 0 THEN count(invcd_oid) ELSE 0 END FROM public.invcd_det WHERE invcd_pt_id = "InvcdDet"."invcd_pt_id" AND invcd_loc_id IN (1002718, 2002719, 3002720) AND invcd_qty = 1 AND invcd_qrbarcode IS NOT NULL AND invcd_is_verified = 'Y' AND invcd_locs_id IS NOT NULL GROUP BY "InvcdDet"."invcd_pt_id" )`), 'quantity_pusat'],
                [Sequelize.literal(`( SELECT CASE WHEN count(invcd_oid) != 0 THEN count(invcd_oid) ELSE 0 END FROM public.invcd_det WHERE invcd_pt_id = "InvcdDet"."invcd_pt_id" AND invcd_loc_id IN (1002718, 2002719, 3002720) AND invcd_scanned_at IS NOT NULL AND invcd_is_verified = 'Y' AND invcd_locs_id IS NOT NULL AND invcd_qty = 0 GROUP BY "InvcdDet"."invcd_pt_id" )`), 'total_outgoing_pusat'],
                [Sequelize.literal(`CAST(SUM(invcd_qty) AS INTEGER)`), 'total_quantity'],
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
                        }, {
                            model: PtCatMstr,
                            as: 'category',
                            required: false,
                            attributes: []
                        }, {
                            model: PtsCatCat,
                            as: 'subcategory',
                            required: false,
                            attributes: []
                        }, {
                            model: PidDet,
                            as: 'singular_relation_pricelist',
                            attributes: [],
                            include: [
                                {
                                    model: PiMstr.scope(['priceListDistributor']),
                                    as: 'header_pricelist',
                                    attributes: []
                                }, {
                                    model: PiddDet.scope(['cashPaymentType']),
                                    as: 'singular_detail_pricelist',
                                    attributes: []
                                }
                            ]
                        }
                    ]
                }
            ],
            where: whereClause,
            group: ['product_id', 'entity', 'product_name', 'product_code', 'category_name', 'subcategory_name', 'release_date', 'pricelist_name', "price"],
            order: [['product_code', 'ASC']],
        });

        return result;
    }

    getProductSalesQuotation = async ( conditions ) => {
        let result = await InvcdDet.findAll({
            attributes: [
                'invcd_invc_oid',
                [Sequelize.literal(`"product->data_entity"."en_desc"`), 'entity'],
                [Sequelize.literal(`"product->site_product_relation"."si_desc"`), 'site'],
                [Sequelize.literal(`"product->singular_relation_pricelist->header_pricelist"."pi_desc"`), 'pricelist'],
                [Sequelize.col(`product.pt_id`), "product_id"],
                [Sequelize.col(`product.pt_code`), "product_code"],
                [Sequelize.col(`product.pt_desc1`), "description1"],
                [Sequelize.col(`product.pt_desc2`), "description2"],
                [Sequelize.literal(`(SELECT area_name FROM public.area_mstr WHERE area_id = :area_id)`), 'area'],
                [Sequelize.literal(`"product->singular_relation_pricelist->singular_detail_pricelist"."pidd_oid"`), 'pidd_oid'],
                [Sequelize.literal(`ROUND("product->singular_relation_pricelist->singular_detail_pricelist"."pidd_price", 2)`), 'price'],
                [Sequelize.literal(`ROUND("product->singular_cost_product"."invct_cost", 2)`), 'cost'],
                ['invcd_loc_id', 'location_id'],
                [Sequelize.col(`location.loc_desc`), 'location_name'],
                [Sequelize.literal(`COUNT(invcd_qty)`), 'qty_on_hand'],
            ],
            include: [
                {
                    model: PtMstr,
                    as:  'product',
                    attributes: [],
                    include: [
                        {
                            model: SiMstr,
                            as: 'site_product_relation',
                            attributes: []
                        }, {
                            model: EnMstr,
                            as: 'data_entity',
                            attributes: []
                        }, {
                            model: InvctTable,
                            as: 'singular_cost_product',
                            attributes: []
                        }, {
                            model: PidDet,
                            as: 'singular_relation_pricelist',
                            attributes: [],
                            include: [
                                {
                                    model: PiMstr,
                                    as: 'header_pricelist',
                                    attributes: []
                                }, {
                                    model: PiddDet,
                                    as: 'singular_detail_pricelist',
                                    attributes: [], 
                                }
                            ]
                        }
                    ]
                }, {
                    model: LocMstr,
                    as: 'location',
                    attributes: []
                }
            ],
            where: [
                Sequelize.where(Sequelize.col(`product.pt_en_id`), {
                    [Op.eq]: conditions.entity_id
                }),
                Sequelize.where(Sequelize.col(`invcd_loc_id`), {
                    [Op.eq]: conditions.location_id
                }),
                Sequelize.where(Sequelize.col(`invcd_booking`), {
                    [Op.eq]: null
                }),
                Sequelize.where(Sequelize.col(`invcd_qty`), {
                    [Op.eq]: 1
                }),
                Sequelize.where(Sequelize.col(`invcd_status`), {
                    [Op.in]: ['available', 'registered', 'hold']
                }),
                Sequelize.where(Sequelize.literal(`"product->singular_relation_pricelist->header_pricelist"."pi_id"`), {
                    [Op.eq]: conditions.pricelist_id
                }),
                Sequelize.where(Sequelize.literal(`"product->singular_relation_pricelist->singular_detail_pricelist"."pidd_payment_type"`), {
                    [Op.eq]: conditions.payment_type_id
                }),
                Sequelize.where(Sequelize.literal(`"product->singular_relation_pricelist->singular_detail_pricelist"."pidd_area_id"`), {
                    [Op.eq]: conditions.area_id
                })
            ],
            group: [
                'invcd_invc_oid',
                'entity',
                'site',
                'pricelist',
                'product_id',
                'product_code',
                'description1',
                'description2',
                'price',
                'cost',
                'location_id',
                'location_name',
                'pidd_oid'
            ],
            replacements: {
                area_id: conditions.area_id
            }
        });

        return result;
    }

    retrieveCostProductsByProductId = async ( productId ) => {
        let result = await InvctTable.findAll({
            attributes: [
                'invct_pt_id',
                'invct_cost'
            ],
            where: {
                invct_pt_id: {
                    [Op.in]: productId
                }
            }
        });

        return result;
    }

    retrieveDataProduct = async ( productId ) => {
        let result = await PtMstr.findOne({
            attributes: [
                ['pt_id', 'product_id'],
                ['pt_code', 'product_code'],
                ['pt_desc1', 'product_name']
            ],
            where: {
                pt_id: productId
            }
        });

        return result;
    }
}

module.exports = new ProductService();
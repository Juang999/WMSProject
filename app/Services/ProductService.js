const {PtMstr, InvcMstr, PtCatMstr, Sequelize} = require('../../models');
const {Op} = require('sequelize');

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
}

module.exports = new ProductService();
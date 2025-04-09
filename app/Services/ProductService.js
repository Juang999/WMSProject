const {PtMstr, InvcMstr, PtCatMstr, Sequelize} = require('../../models');
const {Op} = require('sequelize');

class ProductService {
    findProductByPartnumber = async (partnumber) => {
        let result = await PtMstr.findOne({
            attributes: [
                'pt_en_id',
                'pt_id',
            ],
            where: {
                pt_code: partnumber
            }
        })

        return result;
    }

    getSimpleDataProduct = async (entity_id, location_id, search) => {
        let subQuery = (location_id == null) ? `(SELECT invc_pt_id FROM public.invc_mstr WHERE invc_loc_id IS NOT NULL)` 
                                            : `(SELECT invc_pt_id FROM public.invc_mstr WHERE invc_loc_id = :location_id)`;

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
                    attributes: []
                }
            ],
            where: {
                pt_en_id: entity_id,
                pt_desc1: {
                    [Op.iLike]: `%${search}%`
                },
                pt_id: {
                    [Op.in]: Sequelize.literal(subQuery)
                }
            },
            replacements: {location_id}
        })

        return result;
    }

    getDataCategory = async () => {
        let result = await PtCatMstr.findAll({
            attributes: ['ptcat_id', 'ptcat_desc'],
        })

        return result;
    }
}

module.exports = new ProductService();
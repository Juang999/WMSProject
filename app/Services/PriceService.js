const { PiddDet, PiMstr, Sequelize } = require('../../models');
const { Op } = require('sequelize');

class PriceService {
    retrieveDataPrice = async ( detailPriceListOid ) => {
        let result = await PiddDet.findAll({
            attributes: [
                'pidd_oid', 
                [Sequelize.literal('pidd_price::INTEGER'), 'pidd_price'], 
                [Sequelize.literal(`ROUND(pidd_disc, 2)`), 'pidd_disc']
            ],
            where: {
                pidd_oid: {
                    [Op.in]: detailPriceListOid
                }
            }
        });

        return result;
    }

    retrievePriceListName = async ( entityId, search ) => {
        let result = await PiMstr.findAll({
            attributes: [
                ['pi_oid', 'pricelist_oid'],
                ['pi_id', 'pricelist_id'],
                ['pi_desc', 'pricelist_name']
            ],
            where: {
                pi_en_id: entityId,
                pi_desc: {
                    [Op.iLike]: `%${search}%`
                }
            }
        });

        return result;
    }
}

module.exports = new PriceService();
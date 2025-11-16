const { PiddDet, Sequelize } = require('../../models');
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
}

module.exports = new PriceService();
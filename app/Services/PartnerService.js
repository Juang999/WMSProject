const { PtnrMstr, PtnrgGrp, ArMstr, Sequelize } = require('../../models');
const { Op } = require('sequelize');

class PartnerService {
    retrieveSalesPersonByEntity = async ( entityId, salesName ) => {
        let result = await PtnrMstr.findAll({
            attributes: [
                ['ptnr_id', 'partner_id'],
                ['ptnr_name', 'partner_name']
            ],
            where: {
                ptnr_name: {
                    [Op.iLike]: `%${salesName}%`
                },
                ptnr_en_id: entityId,
                ptnr_is_member: 'Y'
            },
            order: [
                ['ptnr_id', 'ASC']
            ]
        });

        return result;
    }

    retrieveCustomerByEntity = async ( entityId, customerName ) => {
        let result = await PtnrMstr.findAll({
            attributes: [
                ['ptnr_id', 'partner_id'],
                ['ptnr_name', 'partner_name'],
                [Sequelize.literal(`CASE WHEN ptnr_limit_credit != 0 THEN ROUND(ptnr_limit_credit, 2) WHEN ROUND(ptnr_limit_credit, 2) = 0 THEN ROUND("group_partner"."ptnrg_limit_credit", 2) WHEN "group_partner"."ptnrg_limit_credit" = 0 THEN 0 END`), 'limit_credit']
            ],
            include: [
                {
                    model: PtnrgGrp,
                    as: 'group_partner',
                    attributes: []
                }
            ],
            where: {
                ptnr_en_id: entityId,
                ptnr_name: {
                    [Op.iLike]: `%${customerName}%`
                }
            },
            order: [
                ['partner_name', 'ASC']
            ]
        });

        return result;
    }

    findPartnerById = async ( partnerId ) => {
        let result = await PtnrMstr.findOne({
            attributes: [
                ['ptnr_id', 'partner_id'],
                ['ptnr_name', 'partner_name']
            ],
            where: {
                ptnr_id: partnerId
            }
        });

        return result;
    }
}

module.exports = new PartnerService();
const { PtnrMstr, PtnrgGrp, PtnraAddr, ArMstr, Sequelize } = require('../../models');
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
                ['ptnr_code', 'partner_code'],
                ['ptnr_name', 'partner_name'],
                [Sequelize.col(`group_partner.ptnrg_desc`), 'group'],
                [Sequelize.col(`singular_partner_address_relation.ptnra_id`), 'address_id'],
                [Sequelize.fn('CONCAT', Sequelize.col(`singular_partner_address_relation.ptnra_line_1`), ', ', Sequelize.col(`singular_partner_address_relation.ptnra_line_2`), ', ', Sequelize.col(`singular_partner_address_relation.ptnra_line_3`)), 'address'],
                [Sequelize.literal(`CASE WHEN ptnr_limit_credit != 0 THEN ROUND(ptnr_limit_credit, 2) WHEN ROUND(ptnr_limit_credit, 2) = 0 THEN ROUND("group_partner"."ptnrg_limit_credit", 2) WHEN "group_partner"."ptnrg_limit_credit" = 0 THEN 0 END`), 'limit_credit']
            ],
            include: [
                {
                    model: PtnrgGrp,
                    as: 'group_partner',
                    attributes: []
                }, {
                    model: PtnraAddr,
                    as: 'singular_partner_address_relation',
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
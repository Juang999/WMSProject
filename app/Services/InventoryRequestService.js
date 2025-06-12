const { PbMstr, PbdDet, PbdsSerial, PtMstr, Sequelize } = require('../../models');
const { Op } = require('sequelize');
const models = require('../../modules/GetDesc/models');

class InventoryRequestService {
    retrieveDataInventoryRequest = async (search, startDate, endDate) => {
        let result = await PbMstr.findAll({
            attributes: [
                'pb_oid',
                ['pb_requested', 'request_person'],
                'pb_code',
                ['pb_trans_id', 'status_id'],
                ['pb_add_by', 'created_by'],
                ['pb_add_date', 'created_at'],
                ['pb_upd_by', 'updated_by'],
                ['pb_upd_date', 'updated_at'],
            ],
            where: [
                Sequelize.where(Sequelize.col(`pb_code`), {
                    [Op.iLike]: `%${search}%`
                }),
                Sequelize.where(Sequelize.literal(`DATE(pb_add_date)`), {
                    [Op.between]: [startDate, endDate]
                })
            ],
            order: [['created_at', 'DESC']]
        })

        return result;
    }

    findHeaderInventoryReceipt = async (irOid) => {
        let result = await PbMstr.findOne({
            attributes: [
                'pb_oid',
                'pb_code',
                ['pb_rmks', 'remarks'],
                ['pb_add_by', 'created_by'],
                ['pb_add_date', 'created_at'],
                ['pb_upd_by', 'updated_by'],
                ['pb_upd_date', 'updated_at'],
            ],
            include: [
                {
                    model: PbdDet,
                    as: 'detail_inventory_request',
                    attributes: [
                        'pbd_oid',
                        [Sequelize.literal(`"detail_inventory_request->product"."pt_desc1"`), 'product_name'],
                        [Sequelize.literal(`"detail_inventory_request->product"."pt_code"`), 'product_code'],
                        [Sequelize.literal(`CAST("pbd_qty" AS INTEGER)`), 'qty_needed'],
                        [Sequelize.literal(`COUNT("detail_inventory_request->singular_serial_inventory_request"."pbds_oid")`), 'qty_scanned']
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'product',
                            attributes: []
                        }, {
                            model: PbdsSerial,
                            as: 'singular_serial_inventory_request',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                pb_oid: irOid
            },
            group: [
                'pb_oid',
                'pb_code',
                'remarks',
                'created_by',
                'created_at',
                'updated_by',
                'updated_at',
                'pbd_oid',
                Sequelize.literal(`"detail_inventory_request->product"."pt_desc1"`),
                Sequelize.literal(`"detail_inventory_request->product"."pt_code"`),
            ],
            subQuery: false
        });

        return result;
    }
}

module.exports = new InventoryRequestService();
const { 
    TransStatus,
    PtsfrMstr, PtsfrdDet, 
    PtsfrdsSerial, LocMstr,
    Sequelize, EnMstr, PtMstr
} = require('../../models');

class TransferService {
    findDataTransfer = async (transferCode) => {
        let result = await PtsfrMstr.findAll({
            attributes: [
                'ptsfr_oid', 
                ['ptsfr_en_id', 'entity_id'],
                [Sequelize.literal(`"entity"."en_desc"`), 'entity_name'],
                ['ptsfr_en_to_id', 'entity_destination_id'],
                [Sequelize.literal(`"entity_destination"."en_desc"`), 'entity_destination_name'],
                ['ptsfr_code', 'transfer_code'],
                ['ptsfr_date', 'date'],
                ['ptsfr_receive_date', 'receive_date'],
                ['ptsfr_loc_id', 'location_id'],
                [Sequelize.literal(`"location"."loc_desc"`), 'location_name'],
                ['ptsfr_loc_git', 'location_git_id'],
                [Sequelize.literal(`"location_git"."loc_desc"`), 'location_git_name'],
                ['ptsfr_loc_to_id', 'location_destination_id'],
                [Sequelize.literal(`"location_destination"."loc_desc"`), 'location_destination_name'],
                ['ptsfr_trans_id', 'status_id'],
                [Sequelize.literal(`"status"."trans_desc"`), 'status_desc']
            ],
            include: [
                {
                    model: LocMstr,
                    as: 'location',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location_git',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location_destination',
                    attributes: []
                }, {
                    model: EnMstr,
                    as: 'entity',
                    attributes: []
                }, {
                    model: EnMstr,
                    as: 'entity_destination',
                    attributes: []
                }, {
                    model: TransStatus,
                    as: 'status',
                    attributes: []
                }, {
                    model: PtsfrdDet,
                    as: 'detail_transfer',
                    attributes: [
                        'ptsfrd_oid',
                        ['ptsfrd_pt_id', 'product_id'],
                        [Sequelize.literal(`"detail_transfer->product"."pt_desc1"`), 'product_name'],
                        [Sequelize.literal(`"detail_transfer->product"."pt_code"`), 'product_code'],
                        [Sequelize.literal('CAST(ptsfrd_cost AS BIGINT)'), 'cost'],
                        [Sequelize.literal('CAST(ptsfrd_qty AS INTEGER)'), 'qty'],
                        ['ptsfrd_loc_to_id', 'location_destination_id'],
                        [Sequelize.literal(`"detail_transfer->location_destination"."loc_desc"`), 'location_destination_name'],
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'product',
                            attributes: []
                        }, {
                            model: LocMstr,
                            as: 'location_destination',
                            attributes: []
                        }, {
                            model: PtsfrdsSerial,
                            as: 'serial',
                            attributes: [
                                'ptsfrds_oid',
                                ['ptsfrds_lot_serial', 'serial_qrbarcode'],
                                ['ptsfrds_dt', 'timestamp']
                            ]
                        }
                    ]
                }
            ],
            where: {
                ptsfr_code: transferCode
            },
            subQuery: false,
        });

        return result[0];
    }
}

module.exports = new TransferService();
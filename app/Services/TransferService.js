const { 
    TransStatus,
    PtsfrMstr, PtsfrdDet, 
    PtsfrdsSerial, LocMstr,
    Sequelize, EnMstr, PtMstr
} = require('../../models');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { Op } = require('sequelize');

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
                        [Sequelize.literal(`COUNT("detail_transfer->serial"."ptsfrds_oid")`), 'total_scanned']
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
                                ['ptsfrds_qrbarcode', 'serial_qrbarcode'],
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
            group: [
                'ptsfr_oid',
                'entity_name',
                'entity_destination_id',
                'entity_destination_name',
                'transfer_code',
                'date',
                'receive_date',
                'location_id',
                'location_name',
                'location_git_id',
                'location_git_name',
                'location_destination_id',
                'location_destination_name',
                'status_id',
                'status_desc',
                'ptsfrd_oid',
                Sequelize.literal(`"detail_transfer->product"."pt_desc1"`),
                Sequelize.literal(`"detail_transfer->product"."pt_code"`),
                Sequelize.literal('ptsfrd_cost'),
                Sequelize.literal('ptsfrd_qty'),
                Sequelize.literal(`"detail_transfer->location_destination"."loc_desc"`),
                'ptsfrds_oid',
            ]
        });

        return result[0];
    }

    storeUniqueTransfer = async (locationId, subLocationId, qrBarcode, ptsfrdOid) => {
        let result = await PtsfrdsSerial.create({
            ptsfrds_oid: uuidv4(),
            ptsfrds_ptsfrd_oid: ptsfrdOid,
            ptsfrds_qty: 1,
            ptsfrds_si_id: 992,
            ptsfrds_loc_id: locationId,
            ptsfrds_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
            ptsfrds_qrbarcode: qrBarcode,
            ptsfrds_locs_id: subLocationId
        });

        return result;
    }

    findDetailTransferByHeaderOid = async (ptsfrOid, qrBarCode) => {
        let result = await PtsfrdDet.findOne({
            attributes: ['ptsfrd_oid', 'ptsfrd_ptsfr_oid'],
            where: {
                ptsfrd_ptsfr_oid: ptsfrOid,
                ptsfrd_pt_id: {
                    [Op.eq]: Sequelize.literal(`( SELECT invcd_pt_id FROM public.invcd_det WHERE invcd_qrbarcode = '${qrBarCode}' )`)
                }
            }
        });

        return result;
    }

    countSerialTransfer = async (transferCode) => {
        let result = await PtsfrdsSerial.count({
            where: {
                ptsfrds_ptsfrd_oid: {
                    [Op.in]: Sequelize.literal(`( SELECT ptsfrd_oid FROM public.ptsfrd_det WHERE ptsfrd_ptsfr_oid = ( SELECT ptsfr_oid FROM public.ptsfr_mstr WHERE ptsfr_code = :transfer_code ) )`)
                }
            },
            replacements: {
                transfer_code: transferCode
            }
        });

        return result;
    }

    findSerialTransfer = async (transferOid, qrBarcode) => {
        let result = await PtsfrdsSerial.findOne({
            attributes: [
                'ptsfrds_oid',
                ['ptsfrds_qrbarcode', 'serial_qrbarcode'],
                ['ptsfrds_dt', 'timestamp']
            ],
            where: {
                ptsfrds_ptsfrd_oid: Sequelize.literal(`( SELECT ptsfrd_oid FROM public.ptsfrd_det WHERE ptsfrd_ptsfr_oid = '${transferOid}')`),
                ptsfrds_qrbarcode: qrBarcode
            }
        });
        
        return result;
    }
}

module.exports = new TransferService();
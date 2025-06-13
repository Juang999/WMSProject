const { PbMstr, PbdDet, PbdsSerial, PbtType, PtMstr, Sequelize } = require('../../models');
const { Op } = require('sequelize');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

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

    findHeaderInventoryReceipt = async (irCode) => {
        let result = await PbMstr.findAll({
            attributes: [
                'pb_oid',
                'pb_code',
                ['pb_rmks', 'remarks'],
                ['pb_pbt_code', 'ir_type'],
                [Sequelize.literal(`"type_ir"."pbt_desc"`), 'type_name'],
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
                }, {
                    model: PbtType,
                    as: 'type_ir',
                    attributes: []
                }
            ],
            where: {
                pb_code: irCode
            },
            group: [
                'pb_oid',
                'pb_code',
                'pb_pbt_code',
                'remarks',
                'created_by',
                'created_at',
                'updated_by',
                'updated_at',
                'pbd_oid',
                Sequelize.literal(`"detail_inventory_request->product"."pt_desc1"`),
                Sequelize.literal(`"detail_inventory_request->product"."pt_code"`),
                Sequelize.literal(`"type_ir"."pbt_desc"`),
            ],
            subQuery: false
        });

        return result[0];
    }

    findDetailInventoryRequest = async (irdOid) => {
        let result = await PbdDet.findOne({
            attributes: [
                'pbd_oid',
                [Sequelize.col(`"product"."pt_desc1"`), 'product_name'],
                [Sequelize.col(`"product"."pt_code"`), 'product_code'],
                [Sequelize.literal(`CAST(pbd_qty AS INTEGER)`), 'qty_needed']
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }, {
                    model: PbdsSerial,
                    as: 'serial_inventory_request',
                    attributes: [
                        'pbds_oid',
                        ['pbds_qrbarcode', 'unique'],
                        ['pbds_created_by', 'created_by'],
                        ['pbds_created_at', 'created_at']
                    ]
                }
            ],
            where: {
                pbd_oid: irdOid
            }
        });

        return result;
    }

    storeSerialInventoryRequest = async (dataSerial, dataSubLocation, detailInventoryRequestOid, userName, transaction) => {
        let result = await PbdsSerial.create({
            pbds_oid: uuidv4(),
            pbds_pbd_oid: detailInventoryRequestOid,
            pbds_pt_id: dataSerial.invcd_pt_id,
            pbds_qrbarcode: dataSerial.uniq,
            pbds_created_by: userName,
            pbds_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            pbds_loc_id: dataSerial.invcd_loc_id,
            pbds_locs_id: dataSerial.invcd_locs_id,
            pbds_loc_git: dataSubLocation.locs_loc_id,
            pbds_locs_git: dataSubLocation.locs_id
        }, {
            transaction
        });

        return result;
    }

    findSerialInventoryRequest = async (serialNumber, detailInventoryRequestOid) => {
        let result = await PbdsSerial.findOne({
            attributes: [
                Sequelize.literal(`1`),
                'pbds_oid',
                'pbds_loc_id',
                'pbds_locs_id',
                'pbds_loc_git',
                'pbds_locs_git',
                [Sequelize.literal(`"detail_ir->master_ir"."pb_pbt_code"`), 'pbt_type'],
                [Sequelize.literal(`"detail_ir"."pbd_pb_oid"`), 'pb_oid'],
                [Sequelize.literal(`"detail_ir->master_ir"."pb_code"`), 'pb_code'],
            ],
            include: [
                {
                    model: PbdDet,
                    as: 'detail_ir',
                    attributes: [],
                    include: [
                        {
                            model: PbMstr,
                            as: 'master_ir',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                pbds_qrbarcode: serialNumber,
                pbds_pbd_oid: detailInventoryRequestOid
            }
        });

        return result;
    }

    findSerialInventoryRequestByOid = async (detailInventoryRequestOid) => {
        let result = await PbdsSerial.findOne({
            attributes: [
                Sequelize.literal(`1`),
                [Sequelize.literal(`"product"."pt_en_id"`), 'entity_id'],
                'pbds_pt_id',
                'pbds_oid',
                'pbds_loc_id',
                'pbds_locs_id',
                'pbds_loc_git',
                'pbds_locs_git',
            ],
            include: [
                {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }
            ],
            where: {
                pbds_oid: detailInventoryRequestOid
            }
        });

        return result;
    }

    deleteSerial = async (serialInventoryRequestOid, transaction) => {
        let result = await PbdsSerial.destroy({
            where: {
                pbds_oid: serialInventoryRequestOid
            },
            transaction
        });

        return result;
    }

    findDataDetail = async (detailInventoryRequestOid) => {
        let result = await PbdDet.findOne({
            attributes: [
                'pbd_oid',
                ['pbd_pb_oid', 'pb_oid'],
                [Sequelize.literal(`"master_ir"."pb_code"`), 'pb_code'],
                [Sequelize.literal(`"master_ir"."pb_pbt_code"`), 'pbt_code'],
            ],
            include: [
                {
                    model: PbMstr,
                    as: 'master_ir',
                    attributes: []
                }
            ],
            where: {
                pbd_oid: detailInventoryRequestOid
            }
        });

        return result;
    }
}

module.exports = new InventoryRequestService();
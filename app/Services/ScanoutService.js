const {
    LocMstr, LocsMstr,
    sequelize, PtMstr, 
    ScanOutMstr, Sequelize, 
    ScanOutdDet, TransStatus,
} = require('../../models');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');
const {Op} = require('sequelize');
const scanoutddet = require('../../models/scanoutddet');

class ScanoutService {
    createHeaderScanout = async (data, username) => {
        let result = await ScanOutMstr.create({
            sc_oid: uuidv4(),
            sc_en_id: data.entity_id,
            sc_code: await this.scanoutCode({entity_id: data.entity_id}),
            sc_created_by: username,
            sc_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            sc_remarks: data.remarks,
            sc_date: data.date,
            sc_pack_code: data.pack_code,
            sc_so_code: data.so_code,
            sc_receiver_name: data.receiver,
            sc_trans_id: 'D'
        })

        return result;
    }

    scanoutCode = async (data) => {
        let totalScanoutHeader = await this.countScanout();

        let scCode = 'SC';
        let serverCode = '02';
        let scEntity = `${data.entity_id}0`;
        let scYearMonth = moment().format('YYMMDD');
        let monthCode = '00';
        let sequentialCode = (totalScanoutHeader + 1).toString().padStart(4, '0');

        let result = `${scCode}${scEntity}${scYearMonth}${serverCode}${monthCode}${sequentialCode}`;

        return result;
    }

    countScanout = async () => {
        let result = await ScanOutMstr.count({
            where: [
                Sequelize.where(Sequelize.literal("DATE(sc_created_at)"), {
                    [Op.eq]: moment().format('YYYY-MM-DD')
                })
            ]
        })

        return result;
    }

    findScanoutHeader = async (scCode) => {
        let result = await ScanOutMstr.findAll({
            attributes: [
                'sc_oid',
                'sc_en_id',
                'sc_code',
                'sc_created_by',
                'sc_created_at',
                'sc_remarks',
                'sc_date',
                'sc_pack_code',
                'sc_so_code',
                'sc_receiver_name',
                'sc_trans_id',
                'sc_updated_by',
                'sc_updated_at',
                [Sequelize.literal(`COUNT("singular_details"."scd_oid")`), 'counted']
            ],
            include: [
                {
                    model: ScanOutdDet,
                    as: 'details',
                    attributes: [
                        'scd_oid',
                        'scd_serial',
                        [Sequelize.literal(`"details->product"."pt_desc1"`), 'product_name'],
                        [Sequelize.literal(`"details->product"."pt_code"`), 'product_code']
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'product',
                            attributes: []
                        }
                    ]
                }, {
                    model: ScanOutdDet,
                    as: 'singular_details',
                    attributes: []
                }
            ],
            where: {
                sc_code: scCode
            },
            group: [
                'sc_oid',
                'sc_en_id',
                'sc_code',
                'sc_created_by',
                'sc_created_at',
                'sc_remarks',
                'sc_date',
                'sc_pack_code',
                'sc_so_code',
                'sc_receiver_name',
                'sc_trans_id',
                'sc_updated_by',
                'sc_updated_at',
                Sequelize.literal(`"details"."scd_oid"`),
                Sequelize.literal('"details"."scd_serial"'),
                Sequelize.literal(`"details->product"."pt_desc1"`),
                Sequelize.literal(`"details->product"."pt_code"`),
            ],
            subQuery: false
        })

        return result[0];
    }

    createDetailScanout = async (data) => {
        await ScanOutdDet.create({
            scd_oid: uuidv4(),
            scd_en_id: data.entity_id,
            scd_sc_oid: data.scanout_oid,
            scd_pt_id: data.product_id,
            scd_qty: 1,
            scd_created_by: data.username,
            scd_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            scd_loc_id: data.location_id,
            scd_locs_id: data.sublocation_id,
            scd_serial: data.serial
        })
    }

    updateHeaderScanout = async (scanoutOid, data) => {
        await ScanOutMstr.update({
            sc_updated_by: data.username,
            sc_updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            sc_remarks: data.remarks,
            sc_pack_code: data.pack_code,
            sc_so_code: data.so_code,
            sc_receiver_name: data.receiver,
            sc_trans_id: data.transaction_id
        }, {
            where: {
                sc_oid: scanoutOid
            }
        })
    }

    getAllHeader = async (date, scanoutCode, soCode, status) => {
        let result = await ScanOutMstr.findAll({
            attributes: [
                'sc_oid', 
                ['sc_code', 'scanout_code'], 
                'sc_created_by', 
                'sc_created_at', 
                'sc_remarks', 
                'sc_date',
                'sc_pack_code',
                'sc_so_code',
                ['sc_trans_id', 'status_id'],
                'sc_receiver_name',
                [Sequelize.literal(`"transaction_status"."trans_desc"`), 'status'],
                [Sequelize.literal(`COUNT("singular_details"."scd_oid")`), 'counted']
            ],
            include: [
                {
                    model: TransStatus,
                    as: 'transaction_status',
                    attributes: []
                }, {
                    model: ScanOutdDet,
                    as: 'singular_details',
                    attributes: []
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.literal(`DATE(sc_created_at)`), {
                        [Op.eq]: date
                    }),
                    Sequelize.where(Sequelize.col('sc_code'), {
                        [Op.iLike]: `%${scanoutCode}%`
                    }),
                    Sequelize.where(Sequelize.col('sc_so_code'), {
                        [Op.iLike]: `%${soCode}%`
                    }),
                    Sequelize.where(Sequelize.col('sc_trans_id'), {
                        [Op.iLike]: `%${status}%`
                    }),
                ]
            },
            group: [
                'sc_oid',
                'sc_created_by',
                'sc_created_at',
                'sc_remarks',
                'sc_date',
                'sc_pack_code',
                'sc_so_code',
                'sc_receiver_name',
                Sequelize.col(`"transaction_status"."trans_desc"`)
            ],
            order: [
                ['sc_trans_id', 'DESC'],
                ['sc_created_at', 'DESC'],
            ]
        })

        return result;
    }

    deleteSerial = async (scdOid, transaction) => {
        await ScanOutdDet.destroy({
            where: {
                scd_oid: scdOid
            },
            transaction
        })
    }

    findSerialAlreadyScanned = async (scdOid) => {
        let result = await ScanOutdDet.findOne({
            attributes: ['scd_serial'],
            where: {
                scd_oid: scdOid
            }
        })

        return result;
    }

    serialScanOutByDate = async (date, scanoutCode, productName, productCode, locationName, subLocationName ) => {
        let result = await ScanOutdDet.findAll({
            attributes: [
                [Sequelize.col('"master_scanout"."sc_code"'), 'scanout_code'],
                ['scd_pt_id', 'product_id'],
                [Sequelize.col('"product"."pt_desc1"'), 'product_name'],
                [Sequelize.col('"product"."pt_code"'), 'product_code'],
                [Sequelize.col('"location"."loc_desc"'), 'location_name'],
                [Sequelize.col('"sublocation"."locs_name"'), 'sublocation_name'],
                ['scd_created_at', 'timestamp']
            ],
            include: [
                {
                    model: ScanOutMstr,
                    as: 'master_scanout',
                    attributes: []
                }, {
                    model: PtMstr,
                    as: 'product',
                    attributes: []
                }, {
                    model: LocMstr,
                    as: 'location',
                    attributes: []
                }, {
                    model: LocsMstr,
                    as: 'sublocation',
                    attributes: []
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.literal(`DATE(scd_created_at)`), {
                        [Op.eq]: date
                    }),
                    Sequelize.where(Sequelize.literal(`"master_scanout"."sc_code"`), {
                        [Op.iLike]: `%${scanoutCode}%`
                    }),
                    Sequelize.where(Sequelize.literal(`"product"."pt_desc1"`), {
                        [Op.iLike]: `%${productName}%`
                    }),
                    Sequelize.where(Sequelize.literal(`"product"."pt_code"`), {
                        [Op.iLike]: `%${productCode}%`
                    }),
                    Sequelize.where(Sequelize.literal(`"location"."loc_desc"`), {
                        [Op.iLike]: `%${locationName}%`
                    }),
                    Sequelize.where(Sequelize.literal(`"sublocation"."locs_name"`), {
                        [Op.iLike]: `%${subLocationName}%`
                    }),
                ]
            },
            order: [
                ['timestamp', 'DESC']
            ]
        })

        return result;
    }
}

module.exports = new ScanoutService();
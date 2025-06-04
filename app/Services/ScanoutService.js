const {
    LocMstr, LocsMstr,
    sequelize, PtMstr, 
    ScanOutMstr, Sequelize, 
    ScanOutdDet, TransStatus,
} = require('../../models');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');
const {Op, where} = require('sequelize');
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

    findScanoutHeader = async (scCode, orderValue, orderDirection) => {
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
                        [Sequelize.literal(`"details->product"."pt_code"`), 'product_code'],
                        ['scd_created_at', 'timestamp']
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'product',
                            attributes: []
                        }
                    ],
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
            subQuery: false,
            order: [
                [Sequelize.literal(`${orderValue}`), orderDirection]
            ]
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
        let whereClause = {
                [Op.and]: [
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
            }

            if (date != null) {
                whereClause[Op.and].push(Sequelize.where(Sequelize.literal(`DATE(sc_created_at)`), {
                        [Op.eq]: date
                    }))
            }

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
            where: whereClause,
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

    serialScanOutByDate = async ( date, scanoutCode, productName, productCode, locationName, subLocationName, operator, unique ) => {
        let query = `
            SELECT 
                master_scanout.sc_code AS scanout_code,
                detail_scanout.scd_pt_id AS product_id,
                product.pt_desc1 AS product_name,
                product.pt_code AS product_code,
                location.loc_desc AS location_name,
                sublocation.locs_name AS sublocation_name,
                detail_scanout.scd_serial AS uniq,
                detail_scanout.scd_created_by AS operator,
                detail_scanout.scd_created_at AS timestamp
            FROM public.scanoutd_det detail_scanout
            LEFT JOIN public.scanout_mstr master_scanout ON master_scanout.sc_oid = detail_scanout.scd_sc_oid
            LEFT JOIN public.pt_mstr product ON product.pt_id = detail_scanout.scd_pt_id
            LEFT JOIN public.loc_mstr location ON location.loc_id = detail_scanout.scd_loc_id
            LEFT JOIN public.locs_mstr sublocation ON sublocation.locs_id = detail_scanout.scd_locs_id
            WHERE DATE(detail_scanout.scd_created_at) = :date
            AND master_scanout.sc_code ILIKE :scanout_code
            AND product.pt_desc1 ILIKE :product_name
            AND product.pt_code ILIKE :product_code
            AND location.loc_desc ILIKE :location_name
            AND sublocation.locs_name ILIKE :sublocation_name
            AND detail_scanout.scd_created_by ILIKE :pic_name
            AND detail_scanout.scd_serial ILIKE :serial
            UNION
            SELECT
                master_so.so_code AS scanout_code,
                detail_so.sod_pt_id AS product_id,
                product.pt_desc1 AS product_name,
                product.pt_code AS product_code,
                location.loc_desc AS location_name,
                sublocation.locs_name AS sublocation_name,
                serial_so.sods_serial AS uniq,
                serial_so.sods_add_by AS operator,
                serial_so.sods_dt AS timestamp
            FROM public.sods_serial serial_so
            LEFT JOIN public.sod_det detail_so ON detail_so.sod_oid = serial_so.sods_sod_oid
            LEFT JOIN public.so_mstr master_so ON master_so.so_oid = detail_so.sod_so_oid
            LEFT JOIN public.invcd_det serial ON serial.invcd_qrbarcode = serial_so.sods_serial
            LEFT JOIN public.loc_mstr location ON location.loc_id = serial.invcd_loc_id
            LEFT JOIN public.locs_mstr sublocation ON sublocation.locs_id = serial.invcd_locs_id
            LEFT JOIN public.pt_mstr product ON product.pt_id = serial.invcd_pt_id
            WHERE DATE(serial_so.sods_dt) = :date
            AND master_so.so_code ILIKE :scanout_code
            AND product.pt_desc1 ILIKE :product_name
            AND product.pt_code ILIKE :product_code
            AND location.loc_desc ILIKE :location_name
            AND sublocation.locs_name ILIKE :sublocation_name
            AND serial_so.sods_add_by ILIKE :pic_name
            AND serial_so.sods_serial ILIKE :serial
            ORDER BY timestamp DESC
        `;

        let [result] = await sequelize.query(query, {
            replacements: {
                date,
                scanout_code: `%${scanoutCode}%`,
                product_name: `%${productName}%`,
                product_code: `%${productCode}%`,
                location_name: `%${locationName}%`,
                sublocation_name: `%${subLocationName}%`,
                pic_name: `%${operator}%`,
                serial: `%${unique}%`
            }
        });

        return result;
    }

    deleteScanOutHeader = async (scanoutOid, transaction) => {
        let result = await ScanOutMstr.destroy({
            where: {
                sc_oid: scanoutOid
            },
            transaction
        })

        return result;
    }

    getAllSerialInByScanOutOid = async (scanoutOid) => {
        let result = await ScanOutdDet.findAll({
            attributes: ['scd_en_id', 'scd_pt_id', 'scd_serial', 'scd_loc_id', 'scd_locs_id'],
            where: {
                scd_sc_oid: scanoutOid
            }
        });

        return result;
    }

    findDataScanOutByOid = async (scanoutOid) => {
        let result = await ScanOutMstr.findOne({
            attributes: ['sc_en_id', 'sc_oid', 'sc_code'],
            where: {
                sc_oid: scanoutOid
            }
        });

        return result;
    }

    getHeaderScanOut = async (search) => {
        let result = await ScanOutMstr.findAll({
            attributes: [['sc_oid', 'scanout_oid'], ['sc_code', 'scanout_code'], ['sc_created_at', 'created_at']],
            where: {
                sc_code: {
                    [Op.iLike]: `%${search}%`
                }
            },
            order: [['created_at', 'DESC']]
        });

        return result;
    }
}

module.exports = new ScanoutService();
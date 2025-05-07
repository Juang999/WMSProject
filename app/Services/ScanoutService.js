const {ScanOutMstr, Sequelize, sequelize, PtMstr, ScanOutdDet} = require('../../models');
const {v4: uuidv4} = require('uuid');
const moment = require('moment');
const {Op} = require('sequelize');

class ScanoutService {
    createHeaderScanout = async (data) => {
        let result = await ScanOutMstr.create({
            sc_oid: uuidv4(),
            sc_en_id: data.entity_id,
            sc_code: await this.scanoutCode({entity_id: data.entity_id}),
            sc_created_by: 'system',
            sc_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            sc_remarks: data.remarks,
            sc_date: data.date
        })

        return result;
    }

    scanoutCode = async (data) => {
        let totalScanoutHeader = await this.countScanout();

        let scCode = 'SC';
        let serverCode = '02';
        let scEntity = `${data.entity_id}0`;
        let scYearMonth = moment().format('YYMM');
        let monthCode = '0000';
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
        let result = await ScanOutMstr.findOne({
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
                }
            ],
            where: {
                sc_code: scCode
            },
            subQuery: false
        })

        return result;
    }

    createDetailScanout = async (data) => {
        await ScanOutdDet.create({
            scd_oid: uuidv4(),
            scd_en_id: data.entity_id,
            scd_sc_oid: data.scanout_oid,
            scd_pt_id: data.product_id,
            scd_qty: 1,
            scd_created_by: 'system',
            scd_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            scd_loc_id: data.location_id,
            scd_locs_id: data.sublocation_id,
            scd_serial: data.serial
        })
    }

    getAllHeaderr = async (search) => {
        let result = await ScanOutMstr.findAll({
            attributes: ['sc_oid', ['sc_code', 'scanout_code'], 'sc_created_by', 'sc_created_at', 'sc_remarks', 'sc_date'],
            where: {
                sc_code: {
                    [Op.iLike]: `%${search}%`
                }
            }
        })

        return result;
    }
}

module.exports = new ScanoutService();
const { 
    ReturnScanOutMstr, ReturnScanOutdDet, 
    ScanOutMstr, TConfUser, 
    TransStatus, Sequelize,
    PtMstr
} = require('../../models');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { Op, where } = require('sequelize');

class ReturnService {
    insertHeader = async (body, user) => {
        let result = await ReturnScanOutMstr.create({
            rsc_oid: uuidv4(),
            rsc_created_by: user.usernama,
            rsc_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            rsc_sc_oid: body.sc_oid,
            rsc_sc_code: body.sc_code,
            rsc_status_id: 'D',
            rsc_code: await this.returnScanOutCode(body.entity_id),
            rsc_en_id: body.entity_id,
            rsc_userid: body.userid,
            rsc_remarks: body.remarks
        })

        return result;
    }

    returnScanOutCode = async (entityId) => {
        let returnSeq = await this.lastReturnScanoutCode();

        let scCode = 'RSC';
        let scEntity = `${entityId}0`;
        let seqNumber = (returnSeq != null) ? returnSeq.dataValues.scanout_seq + 1 : 1;
        let monthCode = '00';
        let serverCode = '02';
        let scYearMonth = moment().format('YYMMDD');
        let sequentialCode = seqNumber.toString().padStart(4, 0);

        return `${scCode}${scEntity}${scYearMonth}${serverCode}${monthCode}${sequentialCode}`;
    }

    lastReturnScanoutCode = async () => {
        let result = await ReturnScanOutMstr.findOne({
            attributes: [
                [Sequelize.literal(`CAST(RIGHT(rsc_code, 4) AS INTEGER)`), 'scanout_seq']
            ],
            order: [['rsc_created_at', 'DESC']]
        });

        return result;
    }

    getHeader = async (search) => {
        let result = await ReturnScanOutMstr.findAll({
            attributes: [
                'rsc_oid',
                'rsc_code',
                ['rsc_created_by', 'created_by'],
                ['rsc_userid', 'pic_id'],
                [Sequelize.literal(`"user"."usernama"`), 'pic'],
                [Sequelize.literal(`"header_scanout"."sc_so_code"`), 'so_code'],
                ['rsc_status_id', 'status_id'],
                ['rsc_remarks', 'remarks'],
                ['rsc_created_at', 'created_at']
            ],
            include: [
                {
                    model: ScanOutMstr,
                    as: 'header_scanout',
                    attributes: []
                }, {
                    model: TConfUser,
                    as: 'user',
                    attributes: []
                }
            ],
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.col(`rsc_code`), {
                        [Op.iLike]: `%${search.return_code}%`
                    }),
                    Sequelize.where(Sequelize.col(`rsc_sc_code`), {
                        [Op.iLike]: `%${search.scanout_code}%`
                    }),
                ]
            }
        });

        return result;
    }

    findHeader = async (returnScanOutOid) => {
        let result = await ReturnScanOutMstr.findOne({
            attributes: [
                'rsc_oid',
                ['rsc_code', 'return_product_code'],
                ['rsc_sc_oid', 'scanout_oid'],
                [Sequelize.literal(`"header_scanout"."sc_code"`), 'scanout_code'],
                ['rsc_userid', 'pic_id'],
                [Sequelize.literal(`"user"."usernama"`), 'pic_name'],
                ['rsc_status_id', 'status_id'],
                [Sequelize.literal(`"status"."trans_desc"`), 'status_name'],
                ['rsc_remarks', 'remarks'],
                ['rsc_created_by', 'created_by'],
                ['rsc_created_at', 'created_at'],
            ],
            include: [
                {
                    model: TConfUser,
                    as: 'user',
                    attributes: []
                }, {
                    model: TransStatus,
                    as: 'status',
                    attributes: []
                }, {
                    model: ScanOutMstr,
                    as: 'header_scanout',
                    attributes: []
                }, {
                    model: ReturnScanOutdDet,
                    as: 'detail_return_product',
                    attributes: [
                        'rscd_oid',
                        [Sequelize.literal(`"detail_return_product->product"."pt_desc1"`), 'product_name'],
                        ['rscd_qrbarcode', 'unique'],
                        ['rscd_created_by', 'created_by'],
                        ['rscd_created_at', 'created_at']
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
                rsc_oid: returnScanOutOid
            }
        });
        
        return result;
    }

    insertDetail = async (body, username) => {

        let result = await ReturnScanOutdDet.create({
            rscd_oid: uuidv4(),
            rscd_rsc_oid: body.rsc_oid,
            rscd_pt_id: body.pt_id,
            rscd_qrbarcode: body.qrbarcode,
            rscd_created_by: username,
            rscd_created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        })

        return result;
    }

    findDetail = async (rscOid, qrbarcode, productCode) => {
        let result = await ReturnScanOutdDet.findOne({
            attributes: ['rscd_oid', 'rscd_pt_id'],
            where: {
                rscd_rsc_oid: rscOid,
                rscd_qrbarcode: qrbarcode
            },
            replacements: {
                product_code: productCode
            }
        })

        return result;
    }

    deleteDetail = async (rscdRscOid, rscdOid) => {
        let result = await ReturnScanOutdDet.destroy({
            where: {
                rscd_rsc_oid: rscdRscOid,
                rscd_oid: rscdOid
            }
        })

        return result;
    }

    updateHeader = async (body, user, returnScanOutOid) => {
        let result = await ReturnScanOutMstr.update({
            rsc_sc_oid: body.scanout_oid,
            rsc_sc_code: body.scanout_code,
            rsc_status_id: body.status_id,
            rsc_userid: body.pic_id,
            rsc_remarks: body.remarks,
            rsc_updated_by: user.usernama,
            rsc_updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                rsc_oid: returnScanOutOid
            }
        });

        return result;
    }

    deleteHeader = async (rscOid) => {
        let result = await ReturnScanOutMstr.destroy({
            where: {
                rsc_oid: rscOid
            }
        })

        return result;
    }
}

module.exports = new ReturnService();
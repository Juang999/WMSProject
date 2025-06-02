const { ReturnScanOutMstr, ReturnScanOutdDet, ScanOutMstr, TConfUser, Sequelize } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { Op } = require('sequelize');

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
                [Sequelize.literal(`"user"."usernama"`), 'pic'],
                [Sequelize.literal(`"header_scanout"."sc_so_code"`), 'so_code'],
                ['rsc_status_id', 'status_id'],
                ['rsc_remarks', 'remarks']
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
}

module.exports = new ReturnService();
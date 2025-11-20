const moment = require('moment');
const {Op} = require('sequelize');
const {v4: uuidv4} = require('uuid');
const { PlaMstr, AcMstr, PlMstr, Sequelize, GltDet, GCalMstr, GlBalBalance } = require('../../models');

class JournalQueryService {
    retrieveProdLineAccount = async (productLineId, accountCode) => {
        let message = '';
        let status = true;
        let result = null;

        result = await PlaMstr.findOne({
            attributes: [
                ['pla_ac_id', 'account_id'],
                ['pla_sb_id', 'subaccount_id'],
                ['pla_cc_id', 'cost_center_id'],
                [Sequelize.col(`account_relation.ac_code`), 'account_code'],
                [Sequelize.col(`account_relation.ac_sign`), 'account_sign'],
                [Sequelize.col(`account_relation.ac_cu_id`), 'account_currency_id'],
                ['pla_param', 'productline_param'],
                ['pla_desc', 'productline_desc'],
                [Sequelize.literal(`CONCAT("account_relation"."ac_name", ' (', "productline_relation"."pl_desc", ')')`), 'ac_name']
            ],
            include: [
                {
                    model: AcMstr,
                    as: 'account_relation',
                    attributes: []
                }, {
                    model: PlMstr,
                    as: 'productline_relation',
                    attributes: []
                }
            ],
            where: {
                pla_pl_id: productLineId,
                pla_code: accountCode
            }
        });

        if (result == null) {
            status = false;
            result = null;
            message = 'Data Productline kosong'
        } else if (result.dataValues.account_id == null) {
            status = false;
            result = result;
            message = 'Data Productline belum diset Productline nya'
        } else if (parseInt(result.dataValues.account_id) == 0) {
            status = false;
            result = result;
            message = 'Data Productline masih diset Productline nya'
        }

        return {
            status, 
            message,
            data: result,
        };
    }

    insertGltDet = async ( dataGltDet, transaction ) => {
        await GltDet.bulkCreate(dataGltDet, {
            transaction
        });
    }

    countDataGltDetMonthly = async () => {
        const startDate = moment().startOf('months').format('YYYY-MM-DD HH:mm:ss');
        const endDate = moment().endOf('months').format('YYYY-MM-DD HH:mm:ss');

        let result = await GltDet.count({
            where: {
                glt_add_date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        return result;
    }

    findCalendarJournal = async ( date ) => {
        let result = await GCalMstr.findOne({
            attributes: ['gcal_oid'],
            where: {
                gcal_start_date: {
                    [Op.lte]: date
                },
                gcal_end_date: {
                    [Op.gte]: date
                }
            }
        });

        return result;
    }

    findBalance = async ( conditions ) => {
        let result = await GlBalBalance.findOne({
            attributes: ['glbal_oid'],
            where: {
                glbal_en_id: conditions.entity_id,
                glbal_ac_id: conditions.account_id,
                glbal_sb_id: conditions.subaccount_id,
                glbal_cc_id: conditions.cost_center_id,
                glbal_gcal_oid: conditions.calendar_oid
            }
        });

        return result;
    }

    updateBalance = async ( dataUpdate, balanceOid, transaction ) => {
        await GlBalBalance.update({
            glbal_upd_by: dataUpdate.usernama,
            glbal_upd_date: Sequelize.literal(`CURRENT_TIMESTAMP`),
            glbal_balance_unposted: Sequelize.literal(`glbal_balance_unposted - ${dataUpdate.cost}`)
        }, {
            where: {
                glbal_oid: balanceOid
            },
            transaction
        })
    }

    updateGlobalBalance = async (dataAccount, additionalData, transaction) => {
        let result = {
            status: true,
            message: null
        }

        if (dataAccount.account_sign != additionalData.request_sign) {
            dataAccount.cost = dataAccount.cost * -1.0;
        }

        let calendarAccount = await this.findCalendarJournal(additionalData.date);

        if (calendarAccount == null) {
            result.status = false;
            result.message = "Kalender belum dibuat, mohon dibuat terlebih dahulu";

            return result;
        }

        let dataBalance = await this.findBalance({
            entity_id: additionalData.entity_id,
            account_id: dataAccount.account_id,
            subaccount_id: dataAccount.subaccount_id,
            cost_center_id: dataAccount.cost_center_id,
            calendar_oid: calendarAccount.dataValues.gcal_oid
        });

        if (dataBalance == null) {
            result.status = false;
            result.message = "Data balance tidak ada";

            return result;
        }

        await this.updateBalance({
            usernama: additionalData.usernama,
            cost: dataAccount.cost
        }, dataBalance.dataValues.glbal_oid, transaction);

        return result;
    }
}

module.exports = new JournalQueryService();
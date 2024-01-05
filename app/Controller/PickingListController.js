// package
const {v4: uuidv4}  = require('uuid')
const moment = require('moment')
const {Auth, Query} = require('../../helper/helper')
const {Op} = require('sequelize')

// model
const {
    SoMstr, SodDet,
    EnMstr, InvcdDet,
    Sequelize, PtMstr, 
    LocsMstr, sequelize,
    PcklsMstr, PcklsdDet
} = require('../../models')

class PickingListController {
    getDataSalesOrder (req, res) {
        SoMstr.findOne({
            attributes: [
                'so_oid',
                'so_code',
                'so_add_by',
                [Sequelize.literal(`TO_CHAR(so_add_date, 'YYYY-MM-DD HH:mi:ss')`), 'so_add_date']
            ],
            include: [
                {
                    model: SodDet,
                    as: 'detail_sales_order',
                    attributes: [
                        ['sod_oid', 'oid'],
                        ['sod_pt_id', 'pt_id'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_en_id"`), 'en_id'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`), 'pt_code'],
                        [Sequelize.literal(`"detail_sales_order->detail_product->data_entity"."en_desc"`), 'en_desc'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`), 'pt_desc1'],
                        [Sequelize.literal(`"detail_sales_order->detail_sublocation"."pcklsd_sod_qty"`), 'qty'],
                        [Sequelize.literal(`"detail_sales_order->detail_sublocation"."pcklsd_open"`), 'open'],
                        [Sequelize.literal(`"detail_sales_order->detail_sublocation->sublocation_detail"."locs_name"`), 'locs_name'],
                        ['sod_qty_picked', 'qty_picked']
                    ],
                    include: [
                        {
                            model: PtMstr,
                            as: 'detail_product',
                            attributes: [],
                            include: [
                                {
                                    model: EnMstr,
                                    as: 'data_entity',
                                    attributes: []
                                }
                            ]
                        }, 
                        {
                            model: PcklsdDet,
                            as: 'detail_sublocation',
                            attributes: [],
                            include: [
                                {
                                    model: LocsMstr,
                                    as: 'sublocation_detail',
                                    attributes: []
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                so_code: req.params.soCode
            }
        })
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    data: result,
                    error: null
                })
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: 'failed',
                    data: null,
                    error: err.message
                })
        })
    }

    async putProductIntoGITSublocation (req, res) {
        let transaction = await sequelize.transaction()

        try {
            // get data user
            let {usernama} = await Auth(req.headers['authorization'])

            // get qty from original sublocation
            let originalSublocation = await this.getDataOriginalSublocation({
                ptId: req.body.ptId,
                startingSublocation: req.body.startingSublocation
            })

            // run 3 query with Promise
            let proccess = await Promise.all([
                this.UPDATE_SOD_DETAIL({
                    updatesod_request: req.body,
                    updatesod_usernama: usernama
                }),
                this.CREATE_DATA_BASED_GIT_SUBLOCATION({
                    createsubl_request: req.body,
                    createsubl_usernama: usernama
                }),
                this.UPDATE_QUANTITY_ORIGINAL_SUBLOCATION({
                    originalsubl_usernama: usernama,
                    originalsubl_quantity_took: req.body.qty,
                    originalsubl_qty: originalSublocation['dataValues']['qty'],
                    originalsubl_oid: originalSublocation['dataValues']['oid']
                })
            ])

            transaction.commit()

            res.status(200)
                .json({
                    status: 'success',
                    data: proccess[1],
                    error: null
                })
        } catch (error) {
            transaction.rollback()

            res.status(400)
                .json({
                    status: 'failed',
                    data: null,
                    error: error.message
                })
        }
    }

    /*
    * the methods below are used for helper
    */

    UPDATE_SOD_DETAIL = async (parameter) => {
        await SodDet.update({
            sod_qty_picked: parseInt(parameter['updatesod_request']['qty']),
            sod_upd_by: parameter['updatesod_usernama'],
            sod_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                sod_so_oid: parameter['updatesod_request']['soOid'],
                sod_pt_id: parameter['updatesod_request']['ptId']
            },
            logging: (sql, queryCommand) => {
                let bind = queryCommand['bind']

                Query.insert(sql, {
                    bind: {
                        $1: bind[0],
                        $2: bind[1],
                        $3: bind[2],
                        $4: bind[3],
                        $5: bind[4]
                    }
                })
            }
        })
    }

    getDataOriginalSublocation = async (parameter) => {
        return await InvcdDet.findOne({
            attributes: [['invcd_oid', 'oid'], ['invcd_qty', 'qty']], 
            where: {
                invcd_pt_id: parameter['ptId'], 
                invcd_locs_id: parseInt(parameter['startingSublocation'])
            }
        })
    }

    CREATE_DATA_BASED_GIT_SUBLOCATION = async (parameter) => {
        InvcdDet.create({
            invcd_oid: uuidv4(),
            invcd_en_id: parameter['createsubl_request']['enId'],
            invcd_pt_id: parameter['createsubl_request']['ptId'],
            invcd_qty: parameter['createsubl_request']['qty'],
            invcd_locs_id: parseInt(parameter['createsubl_request']['sublocationDestination']),
            invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            invcd_add_by: parameter['createsubl_usernama']
        }, {
            logging: (sql, queryCommand) => {
                let bind = queryCommand['bind']

                Query.insert(sql, {
                    bind: {
                        $1: bind[0],
                        $2: bind[1],
                        $3: bind[2],
                        $4: bind[3],
                        $5: bind[4],
                        $6: bind[5],
                        $7: bind[6],
                    }
                })
            }
        })
    }

    UPDATE_QUANTITY_ORIGINAL_SUBLOCATION = async (parameter) => {
        let quantityAfterSubstaction = parseInt(parameter['originalsubl_qty']) - parseInt(parameter['originalsubl_quantity_took'])

        await InvcdDet.update({
            invcd_qty: quantityAfterSubstaction,
            invcd_upd_by: parameter['originalsubl_usernama'],
            invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                invcd_oid: parameter['originalsubl_oid']
            },
            logging: (sql, queryCommand) => {
                let bind = queryCommand['bind']
                
                Query.insert(sql, {
                    bind: {
                        $1: bind[0],
                        $2: bind[1],
                        $3: bind[2],
                        $4: bind[3],
                    }
                })
            }
        })
    }
}

module.exports = new PickingListController()
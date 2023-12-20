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
                        'sod_oid',
                        'sod_pt_id',
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_en_id"`), 'sod_pt_en_id'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_code"`), 'sod_pt_code'],
                        [Sequelize.literal(`"detail_sales_order->detail_product->data_entity"."en_desc"`), 'sod_en_desc'],
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_desc1"`), 'sod_pt_desc1'],
                        [Sequelize.literal(`"detail_sales_order->detail_sublocation"."pcklsd_sod_qty"`), 'sod_qty'],
                        'sod_qty_picked'
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
                            attributes: []
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

            // get start sublocation & sublocation destination
            let {locs_id: sublocationDestination} = await LocsMstr.findOne({attributes: ['locs_id'], where: {locs_name: req.body.sublocationDestination}})

            // get qty from original sublocation
            let originalSublocation = await InvcdDet.findOne({
                attributes: [['invcd_oid', 'oidStartSublocation'], ['invcd_qty', 'qtyStartSublocation']], 
                where: {
                    invcd_pt_id: req.body.ptId, 
                    invcd_locs_id: {
                        [Op.eq]: Sequelize.literal(`(SELECT locs_id FROM public.locs_mstr WHERE locs_name = '${req.body.startingSublocation}')`)
                    }
                }
            })

            // update qty from original sublocation
            let updateQtyOriginalSublocation = InvcdDet.update({
                invcd_qty: parseInt(originalSublocation['dataValues']['qtyStartSublocation']) - parseInt(req.body.qty),
                invcd_upd_by: usernama,
                invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: {
                    invcd_oid: originalSublocation['dataValues']['oidStartSublocation']
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

            // input data product based on git sublocation
            let createdDataBasedGitSublocation = InvcdDet.create({
                invcd_oid: uuidv4(),
                invcd_en_id: req.body.enId,
                invcd_pt_id: req.body.ptId,
                invcd_qty: req.body.qty,
                invcd_locs_id: sublocationDestination,
                invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                invcd_add_by: usernama
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

            // update table sod_det
            let updateSodDet = SodDet.update({
                sod_qty_picked: parseInt(req.body.qty),
                sod_upd_by: usernama,
                sod_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: {
                    sod_so_oid: req.body.soOid,
                    sod_pt_id: req.body.ptId
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

            // run 3 query with Promise
            let proccess = await Promise.all([updateQtyOriginalSublocation, createdDataBasedGitSublocation, updateSodDet])

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
}

module.exports = new PickingListController()
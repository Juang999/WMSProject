// package
const {v4: uuidv4}  = require('uuid')
const moment = require('moment')
const {Auth} = require('../../helper/helper')

// model
const {
    SoMstr, SodDet,
    EnMstr, InvcdDet,
    Sequelize, PtMstr, 
    PcklsMstr, PcklsdDet
} = require('../../models')

class PickingListController {
    getDataSalesOrder (req, res) {
        SoMstr.findOne({
            attributes: [
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
                        [Sequelize.literal(`"detail_sales_order->detail_product"."pt_en_id"`), 'sod_pt_en_id'],
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
        try {
            let {usernama} = Auth(req.headers['authorization'])

            // get qty from original sublocation
            let {invcd_oid: oidStartSublocation, invcd_qty: qtyStartSublocation} = await InvcdDet.findOne({attributes: ['invcd_oid', 'invcd_qty'], where: {invcd_pt_id: req.body.ptId, invcd_locs_id: req.body.startingSublocation}})

            // input data product based on git sublocation
            let createdDataBasedGitSublocation = await InvcdDet.create({
                invcd_oid: uuidv4(),
                invcd_en_id: req.body.enId,
                invcd_pt_id: req.body.ptId,
                invcd_qty: req.body.qty,
                invcd_locs_id: req.body.locationDestination,
                invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                invcd_add_by: usernama
            })

            let updateSodDet = await SodDet.update({
                sod_qty_picked: req.body.qty,
                sod_upd_by: usernama,
                sod_upd_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: {
                    // sod_oid
                }
            })
        } catch (error) {
            
        }
    }
}

module.exports = new PickingListController()
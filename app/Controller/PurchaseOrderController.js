// modules
let {Auth, Query} = require('../../helper/helper')
let moment = require('moment')
let {Op} = require('sequelize')

// model
const {PoMstr, PodDet, PtMstr, Sequelize, sequelize} = require('../../models')

class PurchaseOrderController {
	detailPurchaseOrder = (req, res) => {
		PoMstr. findOne({
			attributes: [
				['po_oid', 'oid'], 
				['po_code', 'code'], 
				['po_add_by', 'add_by'], 
				['po_add_date', 'add_date'], 
				['po_upd_by', 'upd_by'], 
				['po_upd_date', 'upd_date'],
			],
			include: [
					{
						model: PodDet,
						as: 'detail_purchase_order',
						attributes: [
								['pod_oid', 'detail_oid'],
								[Sequelize.literal('"detail_purchase_order->detail_product"."pt_code"'), 'detail_pt_code'],
								[Sequelize.literal('"detail_purchase_order->detail_product"."pt_desc1"'), 'detail_pt_desec1'],
								['pod_qty', 'detail_qty'],
								['pod_qty_receive', 'detail_qty_receive'],
								[Sequelize.literal('"detail_purchase_order->detail_product"."pt_syslog_code"'), 'detail_syslog_code'],
							],
						include: [
								{
									model: PtMstr,
									as: 'detail_product',
									attributes: [],
									required: true,
									duplicating: false
								}
							]
					}
				],
			where: {
				po_code: req.params.po_oid
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get data purchase order',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get data purchase order',
					error: err.message
				})
		})
	}

	updatePurchaseOrder = async (req, res) => {
		try {
			let transaction = await sequelize.transaction()

			let user = await Auth(req.headers['authorization'])
			let bulkDataPurchaseOrder = JSON.parse(req.body.products)

			for (let dataPurchaseOrder of bulkDataPurchaseOrder) {
				await PodDet.update({
					pod_pud_by: user['usernama'],
					pod_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
					pod_qty_receive: dataPurchaseOrder['qtyReceive'],
					pod_loc_id: dataPurchaseOrder['locId']
				}, {
					where: {
						pod_oid: dataPurchaseOrder['pod_oid']
					},
					logging: async (sql, queryCommand) => {
						let values = queryCommand.bind 

						await Query.insert(sql, {
							bind: {
								$1: values[0],
								$2: values[1],
								$3: values[2],
								$4: values[3],
								$5: values[4],
							}
						})
					}
				})
			}

			await transaction.commit()

			res.status(200)
				.json({
					status: 'success',
					message: 'data uploaded',
					data: 1
				})
		} catch (err) {
			res.status(400)
				.json({
					status: 'failed',
					message: "data don't upload!",
					error: err.message 
				})
		}
	}

	getHistoryPurchaseOrder = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization'])

			let historyChecked = await PoMstr.findAll({
				attributes: [
					['po_oid', 'oid'], 
					['po_code', 'code'], 
					['po_add_by', 'add_by'], 
					['po_add_date', 'add_date'], 
					['po_upd_by', 'upd_by'], 
					['po_upd_date', 'upd_date'],
				],
				include: [
						{
							model: PodDet,
							as: 'detail_purchase_order',
							attributes: [
									['pod_oid', 'detail_oid'],
									[Sequelize.literal('"detail_purchase_order->detail_product"."pt_code"'), 'detail_pt_code'],
									[Sequelize.literal('"detail_purchase_order->detail_product"."pt_desc1"'), 'detail_pt_desec1'],
									['pod_qty', 'detail_qty'],
									['pod_qty_receive', 'detail_qty_receive'],
									[Sequelize.literal('"detail_purchase_order->detail_product"."pt_syslog_code"'), 'detail_syslog_code'],
								],
							include: [
									{
										model: PtMstr,
										as: 'detail_product',
										attributes: [],
										required: true,
										duplicating: false
									}
								]
						}
					],
				where: {
					po_oid: {
						[Op.in]: Sequelize.literal(`(SELECT pod_po_oid FROM public.pod_det WHERE pod_upd_by = '${user['usernama']}')`)
					}
				},
				order: [[Sequelize.literal('detail_purchase_order.pod_upd_date'), 'desc']]
			})

			res.status(200)
				.json({
					status: 'success',
					message: 'success to get history purchase order',
					data: historyChecked
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get history order',
					error: error.message
				})
		}
	}

	getPurchaseOrderToday = (req, res) => {
		let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD 00:00:00')
		let endDate = (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD 23:59:59') : moment().format('YYYY-MM-DD 23:59:59')

		PoMstr.findAll({
				attributes: [
					['po_oid', 'oid'], 
					['po_code', 'code'], 
					['po_add_by', 'add_by'], 
					['po_add_date', 'add_date'], 
					['po_upd_by', 'upd_by'], 
					['po_upd_date', 'upd_date'],
				],
				include: [
						{
							model: PodDet,
							as: 'detail_purchase_order',
							attributes: [
									['pod_oid', 'detail_oid'],
									[Sequelize.literal('"detail_purchase_order->detail_product"."pt_code"'), 'detail_pt_code'],
									[Sequelize.literal('"detail_purchase_order->detail_product"."pt_desc1"'), 'detail_pt_desec1'],
									['pod_qty', 'detail_qty'],
									['pod_qty_receive', 'detail_qty_receive'],
									[Sequelize.literal('"detail_purchase_order->detail_product"."pt_syslog_code"'), 'detail_syslog_code']
								],
							include: [
									{
										model: PtMstr,
										as: 'detail_product',
										attributes: [],
										required: true,
										duplicating: false
									}
								]
						}
					],
				where: {
					po_oid: {
						[Op.in]: Sequelize.literal(`(SELECT pod_po_oid FROM public.pod_det WHERE pod_upd_by IS NULL)`)
					}, 
					po_add_date: {
						[Op.between]: [startDate, endDate]
					}
				},
				order: [[Sequelize.literal('detail_purchase_order.pod_upd_date'), 'desc']]
			})
			.then(result => {
				res.status(200)
					.json({
						status: 'success',
						message: 'success to get data',
						data: result
					})
			})
			.catch(err => {
				res.status(400)
					.json({
						status: 'failed',
						message: 'failed to get data',
						error: err.message
					})
			})
	}
}

module.exports = new PurchaseOrderController()
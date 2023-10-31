// module
const {Auth, Query} = require('../../helper/helper')
const moment = require('moment')
const {Op} = require('Sequelize')

// model
const {SoMstr, SodDet, PtMstr, Sequelize, PtnrMstr, LocMstr} = require('../../models')

class SalesOrderController {
	detailSalesOrder = (req, res) => {
		SoMstr.findOne({
			attributes: [
				['so_oid', 'oid'], 
				['so_code', 'code'], 
				['so_add_by', 'add_by'], 
				['so_add_date', 'add_date'], 
				['so_upd_by', 'upd_by'], 
				['so_upd_date', 'upd_date'],
				[Sequelize.literal('"buyer"."ptnr_name"'), 'customer'],
				],
			include: [
					{
						model: PtnrMstr,
						as: 'buyer',
						attributes: [],
						required: true,
						duplicating: false
					}, {
						model: SodDet,
						as: 'detail_sales_order',
						attributes: [
								['sod_oid', 'detail_oid'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_code"'), 'detail_pt_code'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_desc1"'), 'detail_pt_desc1'],
								['sod_qty', 'detail_qty'],
								['sod_qty_checked', 'detail_qty_checked'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_syslog_code"'), 'detail_syslog_code'],
							],
						include: [
								{
									model: PtMstr,
									as: 'detail_product',
									attributes: []
								}
							]
					}
				],
			where: {
				so_code: req.params.so_code
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get data sales order',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get data sales order',
					error: err.message
				})
		})
	}

	updateQtySalesOrder = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization'])
			let detailQtyChecked = JSON.parse(req.body.products)

			for (let dataQtyChecked of detailQtyChecked) {
				await SodDet.update({
					sod_upd_by: user['usernama'],
					sod_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
					sod_qty_checked: dataQtyChecked['qtyChecked']
				}, {
					where: {
						sod_oid: dataQtyChecked['sod_oid']
					}, 
					logging: async (sql, queryCommand) => {
						let value = queryCommand.bind

						await Query.insert(sql, {
							bind: {
								$1: value[0],
								$2: value[1],
								$3: value[2],
								$4: value[3],
							}
						})
					}
				})
			}

			res.status(200)
				.json({
					status: 'success',
					message: 'success to update SO'	
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to update SO',
					error: error.message
				})
		}
	}

	getHistory = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization'])

			let dataSalesOrder = await SoMstr.findAll({
				attributes: [
						['so_oid', 'oid'], 
						['so_code', 'code'], 
						['so_add_by', 'add_by'], 
						['so_add_date', 'add_date'], 
						['so_upd_by', 'upd_by'], 
						['so_upd_date', 'upd_date']
					],
				include: [
						{
							model: SodDet,
							as: 'detail_sales_order',
							attributes: [
									['sod_oid', 'detail_oid'],
									[Sequelize.literal('"detail_sales_order->detail_product"."pt_desc1"'), 'detail_pt_desc1'],
									['sod_qty', 'detail_qty'],
									['sod_qty_checked', 'detail_qty_checked'],
								],
							include: [
									{
										model: PtMstr,
										as: 'detail_product',
										attributes: []
									}
								]
						}
					],
					where: {
						so_oid: {
							[Op.in]: Sequelize.literal(`(SELECT sod_so_oid FROM public.sod_det WHERE sod_upd_by = '${user['usernama']}')`)
						}
					}
			})

			res.status(200)
				.json({
					status: 'success',
					message: 'success to get',
					data: dataSalesOrder
				})
		} catch (err) {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get data history',
					error: error.message
				})
		}
	}

	getSalesOrderToday = (req, res) => {
		let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD HH:mm:ss')
		let endDate = (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD 23:59:59') : moment().format('YYYY-MM-DD 23:59:59')

		SoMstr.findAll({
			attributes: [
				['so_oid', 'oid'], 
				['so_code', 'code'], 
				['so_add_by', 'add_by'], 
				['so_add_date', 'add_date'], 
				['so_upd_by', 'upd_by'], 
				['so_upd_date', 'upd_date'],
				[Sequelize.literal('"buyer"."ptnr_name"'), 'customer'],
				],
			include: [
					{
						model: PtnrMstr,
						as: 'buyer',
						attributes: [],
						required: true,
						duplicating: false
					}, {
						model: SodDet,
						as: 'detail_sales_order',
						attributes: [
								['sod_oid', 'detail_oid'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_code"'), 'detail_pt_code'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_desc1"'), 'detail_pt_desc1'],
								['sod_qty', 'detail_qty'],
								['sod_qty_checked', 'detail_qty_checked'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_syslog_code"'), 'detail_syslog_code'],
							],
						include: [
								{
									model: PtMstr,
									as: 'detail_product',
									attributes: []
								}
							]
					}
				],
			where: {
				so_upd_by: {
					[Op.is]: null
				},
				so_add_date: {
					[Op.between]: [startDate, endDate]
				}
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get data sales order',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get data sales order',
					error: err.message
				})
		})
	}
}

module.exports = new SalesOrderController()
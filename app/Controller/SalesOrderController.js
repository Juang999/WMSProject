// module
const {Auth, Query} = require('../../helper/helper')
const moment = require('moment')
const {Op} = require('sequelize')
const {InventoryService, SalesOrderService} = require('../Services/ServiceContainer')
const {v4: uuidv4} = require('uuid');
// model
const {SoMstr, SodDet, PtMstr, Sequelize, PtnrMstr, LocMstr, sequelize} = require('../../models')

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

	scanOut = (req, res) => {
		let {serial_number, transaction_oid, entity_id} = req.body;

		sequelize.transaction(async t => {
			let dataSerial = await InventoryService.findSerialNumber(serial_number, t);

			if (!dataSerial) {
				return this.returnResponse(300, 'rejected', 'serial not found', null)
			}

			if (dataSerial.dataValues.qty == 0) {
				return this.returnResponse(300, 'rejected', 'serial has scanned out!', null)
			}

			if (dataSerial.dataValues.entity_id != entity_id) {
				return this.returnResponse(300, 'rejected', 'serial not belong to this entity', null)
			}

			if (dataSerial.dataValues.uniq == null || dataSerial.dataValues.invcd_locs_id == null) {
				return this.returnResponse(300, 'rejected', 'Unregistered serial', null)
			}

			let historySerial = {
				invcdh_oid: uuidv4(),
				invcdh_dom_id: dataSerial.dataValues.invcd_dom_id,
				invcdh_en_id: dataSerial.dataValues.invcd_en_id,
				invcdh_pt_id: dataSerial.dataValues.invcd_pt_id,
				invcdh_loc_from_id: dataSerial.dataValues.invcd_loc_id,
				invcdh_locs_from_id: dataSerial.dataValues.invcd_locs_id,
				invcdh_qrbarcode: (dataSerial.dataValues.uniq != null) ?dataSerial.dataValues.uniq : dataSerial.dataValues.alias_uniq,
				invcdh_status: 'scanned out!',
				invcdh_remarks: `scanned out reference to oid: ${transaction_oid}`,
				invcdh_created_by: 'system',
				invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
			}

			await Promise.all([
				InventoryService.scanoutSerial(dataSerial.dataValues.invcd_oid, transaction_oid, t),
				InventoryService.createHistory([historySerial], t)
			])

			return this.returnResponse(200, 'success', 'success to scan out serial', null)
		})
		.then(result => {
			res.status(result.code)
				.json(result.json)
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to scan out serial',
					data: null,
					error: err.message
				})
		})
	}

	getScannedOutSerial = (req, res) => {
		InventoryService.getScannedOutSerial(req.params.transaction_oid)
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get scanned out serial',
					data: result,
					error: null
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get scanned out serial',
					data: null,
					error: err.message
				})
		})
	}

	returnResponse = (code, status, message, data) => {
		return {code, json: {status, message, data, error: null}}
	}
}

module.exports = new SalesOrderController()
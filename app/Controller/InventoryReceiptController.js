// modules
let {Op} = require('sequelize')
let moment = require('moment')
let {v4: uuidv4} = require('uuid')
let {Auth, Query} = require('../../helper/helper')
let {eraseData} = require('./SublocationController')

// model
const {
	LocMstr,
	EnMstr, AcMstr,
	RiuMstr, RiudDet,
	PtMstr, InvcdDet,
	RiumMstr, RiumdDet, 
	Sequelize, sequelize,
	LocsMstr, LocsTemporary,
} = require('../../models')

class InventoryReceiptController {
	store = async (req, res) => {
		// start transaction
		let transaction = await sequelize.transaction()

		// get data user
		try {
			let user = await Auth(req.headers['authorization'])

			let bulkBodyInventoryReceipt = JSON.parse(req.body.products)
			let dataInventoryReceipt = []

			for (let bodyInventoryReceipt of bulkBodyInventoryReceipt) {
					let dataBodyInventoryReceipt = {
						riumd_oid: uuidv4(),
						riumd_rium_oid: bodyInventoryReceipt['rium_oid'],
						riumd_pt_id: bodyInventoryReceipt['ptId'],
						riumd_qty: bodyInventoryReceipt['qty'],
						riumd_um: bodyInventoryReceipt['um'],
						riumd_um_conv: 1,
						riumd_qty_real: bodyInventoryReceipt['qty']/1,
						riumd_si_id: 992,
						riumd_loc_id: bodyInventoryReceipt['locId'],
						riumd_cost: bodyInventoryReceipt['cost'],
						riumd_ac_id: bodyInventoryReceipt['acId'],
						riumd_sb_id: 0,
						riumd_cc_id: 0,
						riumd_dt: moment().format('YYYY-MM-DD'),
						riumd_cost_total: bodyInventoryReceipt['costTotal'],
						riumd_locs_id: bodyInventoryReceipt['locsId']
					}

					let request = {
						enId: bodyInventoryReceipt['en_id'],
						qty: dataBodyInventoryReceipt['riumd_qty'],
						ptId: dataBodyInventoryReceipt['riumd_pt_id'],
						locsId: dataBodyInventoryReceipt['riumd_locs_id']
					}

					await this.inputIntoInvcdDet(user, request)

					dataInventoryReceipt.push(dataBodyInventoryReceipt)
			}

           	// create bulk body inventory receipt
			await RiumdDet.bulkCreate(dataInventoryReceipt, {
				logging: (sql) => {
					Query.queryBulkCreate(sql)
				}
			})

			await eraseData(user['userid'], 'IR')

           	// commit transaction
			await transaction.commit()

			res.status(200)
				.json({
					status: 'success',
					message: 'success post data'
				})
		} catch (error) {
			// rollback transaction
			await transaction.rollback()

			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to post data',
					error: error.message
				})
		}
	}

	getHistory = async (req, res) => {
			try {
				let startDate = (req.query.start_date) ? req.query.start_date : moment().startOf('months').format('YYYY-MM-DD 00:00:00')
				let endDate = (req.query.end_date) ? req.query.end_date : moment().endOf('months').format('YYYY-MM-DD 23:59:59')

				let user = await Auth(req.headers['authorization'])

				let dataInventoryReceipt = await RiumMstr.findAll({
					attributes: [
						['rium_oid', 'oid'],
						['rium_type2', 'code'], 
						['rium_add_by', 'add_by'], 
						['rium_add_date', 'add_date']
						],
					include: [
							{
								model: RiumdDet,
								as: 'detail_inventory_receipt',
								attributes: [
										['riumd_oid', 'detail_oid'],
										[Sequelize.literal('"detail_inventory_receipt->detail_product"."pt_code"'), 'detail_pt_code'],
										[Sequelize.literal('"detail_inventory_receipt->detail_product"."pt_desc1"'), 'detail_pt_desc1'],
										['riumd_qty', 'detail_qty'],
										[Sequelize.literal('"detail_inventory_receipt->detail_product"."pt_syslog_code"'), 'detail_syslog_code']
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
						rium_add_by: user['usernama'],
						rium_add_date: {
							[Op.between]: [startDate, endDate]
						}
					},
					order: [['rium_add_date', 'desc']],
				})

				res.status(200)
					.json({
						status: 'success',
						message: 'success to get data',
						data: dataInventoryReceipt
					})
			} catch (error) {
				res.status(200)
					.json({
						status: 'failed',
						message: 'failed to get data',
						data: error.message
					})
			}
	}

	updateDetailInventoryReceipt = (req, res) => {
		RiumdDet.update({
            riumd_pt_id: req.body.ptId,
			riumd_qty: req.body.qty,
			riumd_um: req.body.um,
			riumd_um_conv: 1,
			riumd_qty_real: req.body.qty / 1,
			riumd_loc_id: req.body.locId,
			riumd_cost: req.body.cost,
			riumd_ac_id: req.body.acId,
			riumd_cost_total: req.body.costTotal,				
		}, {
			where: {
				riumd_oid: req.params.riumd_oid
			},
			logging: (sql, queryCommand) => {
				let value = queryCommand.bind

				Query.insert(sql, {
					bind: {
						$1: value[0],
						$2: value[1],
						$3: value[2],
						$4: value[3],
						$5: value[4],
						$6: value[5],
						$7: value[6],
						$8: value[7],
						$9: value[8],
						$10: value[9],
					}
				})
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'data updated'
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to update',
					error: err.message
				})
		})
	}

	updateType = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization'])

			await RiumMstr.update({
				rium_upd_by: user['usernama'],
				rium_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				rium_type: req.body.type
			}, {
				where: {
					rium_oid: req.params.rium_oid
				},
				logging: (sql, queryCommand) => {
					let values = queryCommand.bind

					Query.insert(sql, {
						bind: {
							$1: values[0],
							$2: values[1],
							$3: values[2],
							$4: values[3],
						}
					})
				}
			})

			res.status(200)
				.json({
					status: 'success',
					message: 'type updated'
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					message: "can't update type",
					error: error.message
				})
		}
	}

	generateCode = async (enId) => {
			// startdate & enddate
			let startDate = moment().startOf('months').format('YYYY-MM-DD 00:00:00')
			let endDate = moment().endOf('months').format('YYYY-MM-DD 23:59:59')

			// count total data in this month
			let countData = await RiumMstr.count({
				where: {
					rium_add_date: {
						[Op.between]: [startDate, endDate]
					}
				}
			})

			let totalData = (countData == 0) ? 1 : countData + 1
			let baseCode = '0000'
			let splitBaseCode = baseCode.slice(0, -totalData.toString().length)
			let combineCode = splitBaseCode+totalData

			let resultCode = `IRM0${enId}${moment().format('YYMM')}00001${combineCode}`

			return resultCode
	}

	createHeader = async (req, res) => {
		try {
			// get data user
			let user = await Auth(req.headers['authorization'])

			let code = await this.generateCode(req.body.enId)

			let dataHeader = await RiumMstr.create({
				rium_oid: uuidv4(),
				rium_dom_id: 1,
				rium_en_id: req.body.enId,
				rium_add_by: user['usernama'],
				rium_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				rium_type2: code,
				rium_date: moment().format('YYYY-MM-DD'),
				rium_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
				rium_type: req.body.type,
				rium_remarks: req.body.remarks,
				rium_pack_vend: req.body.vendorCode
			}, {
				logging: (sql, queryCommand) => {
					let values = queryCommand.bind
					Query.insert(sql, {
						bind: {
							$1: values[0],
							$2: values[1],
							$3: values[2],
							$4: values[3],
							$5: values[4],
							$6: values[5],
							$7: values[6],
							$8: values[7],
							$9: values[8],
							$10: values[9],
						}
					})
				}
			})

			res.status(200)
				.json({
					status: 'success',
					data: dataHeader,
					error: null
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					data: null,
					error: error.message
				})
		}
	}

	inputIntoInvcdDet = async (user, request) => {
		let showResultData = await InvcdDet.findOne({where: {invcd_pt_id: request['ptId'], invcd_locs_id: request['locsId']}})

		let qtyTotal = parseInt(request['qty']) + parseInt(showResultData['invcd_qty'])
		if (showResultData) {
			await InvcdDet.update({
				invcd_upd_by: user['usernama'],
				invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				invcd_qty: qtyTotal
			}, {
				where: {
					invcd_pt_id: request['ptId'],
					invcd_locs_id: request['locsId'],
				},
				logging: (sql, queryCommand) => {
					let value = queryCommand.bind

					Query.insert(sql, {
						bind: {
							$1: value[0],
							$2: value[1],
							$3: value[2],
							$4: value[3],
							$5: value[4]
						}
					})
				}
			})
		} else {
			await InvcdDet.create({
				invcd_oid: uuidv4(),
				invcd_en_id: request['enId'],
				invcd_qty: request['qty'],
				invcd_pt_id: request['ptId'],
				invcd_locs_id: request['locsId'],
				invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				invcd_add_by: user['usernama']
			}, {
				logging: (sql, queryCommand) => {
					let value = queryCommand.bind

					Query.insert(sql, {
						bind: {
							$1: value[0],
							$2: value[1],
							$3: value[2],
							$4: value[3],
							$5: value[4],
							$6: value[5],
							$7: value[6],
						}
					})
				}
			})
		}
	}

	getInventoryReceiptFromExapro (req, res) {
		let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD 00:00:00') : moment().startOf('months').format('YYYY-MM-DD 00:00:00')
		let endDate = (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD 23:59:59') : moment().endOf('months').format('YYYY-MM-DD 23:59:59')
		
		RiuMstr.findAll({
			attributes: ['riu_oid', 'riu_type2'],
			where: {
				riu_add_date: {
					[Op.between]: [startDate, endDate]
				}
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

	getDetailInventoryReceiptFromExapro (req, res) {
		RiuMstr.findOne({
			attributes: [
				'riu_oid', 
				'riu_type2',
				'riu_type',
				'riu_en_id',
				[Sequelize.col('data_entity.en_desc'), 'en_desc'],
				'riu_cost_total',
				[Sequelize.literal(`(SELECT SUM(riud_cost * riud_qty) FROM public.riud_det WHERE riud_riu_oid = riu_oid)`), 'cost_total'],
				[Sequelize.literal(`(SELECT SUM(riud_qty) FROM public.riud_det WHERE riud_riu_oid = riu_oid)`), 'qty_total'],
			],
			include: [
				{
					model: RiudDet,
					as: 'detail_receive_inventory',
					attributes: [
						'riud_oid', 
						'riud_riu_oid', 
						'riud_pt_id', 
						[Sequelize.literal(`"detail_receive_inventory->detail_product"."pt_desc1"`), 'riud_proudct_name'],
						[Sequelize.literal(`"detail_receive_inventory->detail_product"."pt_code"`), 'riud_proudct_code'],
						'riud_um',
						'riud_loc_id',
						'riud_ac_id',
						'riud_qty',
						'riud_qty_real',
						'riud_cost',
						[Sequelize.literal(`riud_cost * riud_qty`), 'cost_total'],
						[Sequelize.literal(`"detail_receive_inventory->detail_data_location"."loc_desc"`), 'riud_loc_desc'],
						'riud_locs_id',
						[Sequelize.literal(`CASE WHEN "detail_receive_inventory->detail_data_sublocation"."locs_name" IS NULL THEN '-' ELSE "detail_receive_inventory->detail_data_sublocation"."locs_name" END`), 'riud_locs_desc'],
						[Sequelize.literal(`"detail_receive_inventory->detail_data_account"."ac_name"`), 'riud_ac_desc']
					],
					include: [
						{
							model: PtMstr,
							as: 'detail_product',
							attributes: []
						},
						{
							model: AcMstr,
							as: 'detail_data_account',
							attributes: []
						},
						{
							model: LocMstr,
							as: 'detail_data_location',
							attributes: []
						},
						{
							model: LocsMstr,
							as: 'detail_data_sublocation',
							attributes: []
						}
					]
				},
				{
					model: EnMstr,
					as: 'data_entity',
					attributes: []
				}
			],
			where: {
				riu_oid: req.params.riu_oid
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

	async inputIntoTemporary (req, res) {
		try {
			let totalSublocationNeed = Math.ceil(req.body.qty / req.body.qtyPerSublocation)

			let dataSubLocation = await LocsMstr.findAll({
				attributes: [
					'locs_id', 
					'locs_name',
					'locs_active'
				],
				where: {
					[Op.and]: [
						Sequelize.where(Sequelize.col('locs_id'), {
							[Op.notIn]: Sequelize.literal(`(SELECT invcd_locs_id FROM public.invcd_det)`)
						}),
						Sequelize.where(Sequelize.col('locs_id'), {
							[Op.notIn]: Sequelize.literal(`(SELECT locst_locs_id FROM public.locs_temporary)`)
						})
					],
					locs_active: 'Y'
				},
				order: [['locs_id', `ASC`]],
				limit: totalSublocationNeed
			})

			let dataSetToInsertIntoThelocsTemporaryTable = []

			for (let index = 0; index < totalSublocationNeed; index++) {

				dataSetToInsertIntoThelocsTemporaryTable.push({
					locst_oid: uuidv4(),
					locst_locs_id: (dataSubLocation[index] != null) ? dataSubLocation[index]['locs_id'] : null,
					locst_type: 'IR',
					locst_header_oid: req.body.headerOid,
					locst_pt_id: req.body.ptId,
					locst_pt_qty: req.body.qtyPerSublocation,
					locst_um: req.body.um,
					locst_qty_real: req.body.qtyReal,
					locst_loc_id: req.body.locId,
					locst_ac_id: req.body.acId,
					locst_cost: req.body.cost,
					locst_cost_total: req.body.costTotal
				})
			}

			let inputIntoTemporaryTable = await LocsTemporary.bulkCreate(dataSetToInsertIntoThelocsTemporaryTable, {
				logging: (sql) => {
					Query.bulkCreate(sql)
				}
			})

			res.status(200)
				.json({
					status: 'success',
					data: inputIntoTemporaryTable,
					error: null
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					data: null,
					error: error.message
				})
		}
	}

	getDataTemporary (req, res) {
		LocsTemporary.findAll({
			attributes: [
				'locst_oid',
				'locst_header_oid',
				'locst_pt_id',
				'locst_pt_qty',
				'locst_um',
				'locst_loc_id',
				'locst_locs_id',
				'locst_ac_id',
				'locst_cost',
				[Sequelize.literal(`"data_product->data_entity"."en_id"`), 'locst_en_id'],
				[Sequelize.col('data_location.loc_desc'), 'locst_loc_name'],
				[Sequelize.col('data_sublocation.locs_name'), 'locst_locs_name'],
			],
			include: [
				{
					model: LocsMstr,
					as: 'data_sublocation',
					attributes: []
				},
				{
					model: LocMstr,
					as: 'data_location',
					attributes: []
				},
				{
					model: PtMstr,
					as: 'data_product',
					attributes: [],
					include: [
						{
							model: EnMstr,
							as: 'data_entity',
							attributes: []
						}
					]
				}
			],
			where: {
				locst_header_oid: req.query.header_oid,
				locst_pt_id: req.query.pt_id
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

	updateDataTemporary (req, res) {
		LocsTemporary.update({
			locst_locs_id: req.body.locsId,
			locst_pt_qty: req.body.ptQty
		}, {
			where: {
				locst_oid: req.params.locstOid
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

	deleteDataTemporary (req, res) {
		LocsTemporary.destroy({
			where: {
				locst_oid: req.params.locstOid
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
}

module.exports = new InventoryReceiptController()
// modules
let {Op} = require('sequelize')
let moment = require('moment')
let {v4: uuidv4} = require('uuid')
let {Auth, Query} = require('../../helper/helper')

// model
const {
	PtMstr,
	RiumMstr, RiumdDet, 
	Sequelize, sequelize
} = require('../../models')

class InventoryReceiptController {
	store = async (req, res) => {
		// start transaction
		let transaction = await sequelize.transaction()

		// get data user
		let user = await Auth(req.headers['authorization'])
		try {
			// generate code
			let code = await this.generateCode(req.body.enId)

			// create header inventory receipt
            let headerInventoryReceipt = await RiumMstr.create({
            	rium_oid: uuidv4(),
            	rium_dom_id: 1,
            	rium_en_id: req.body.enId,
            	rium_add_by: user['usernama'],
            	rium_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            	rium_type2: code,
            	rium_date: moment().format('YYYY-MM-DD'),
            	rium_type: req.body.type,
            	rium_remarks: req.body.remarks,
            	rium_pack_cend: req.body.vendorCode
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

           	let bulkBodyInventoryReceipt = JSON.parse(req.body.products)
           	let dataInventoryReceipt = []

           	for (let bodyInventoryReceipt of bulkBodyInventoryReceipt) {
           			let dataBodyInventoryReceipt = {
           				riumd_oid: uuidv4(),
           				riumd_rium_oid: headerInventoryReceipt['rium_oid'],
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

           			dataInventoryReceipt.push(dataBodyInventoryReceipt)
           	}

           	// create bulk body inventory receipt
           	await RiumdDet.bulkCreate(dataInventoryReceipt, {
           		logging: (sql) => {
           			Query.queryBulkCreate(sql)
           		}
           	})

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

			let totalData = (countData == 0) ? 1 : countData
			let baseCode = '0000'
			let splitBaseCode = baseCode.slice(0, -totalData.toString().length)
			let combineCode = splitBaseCode+totalData

			let resultCode = `IRM0${enId}${moment().format('YYMM')}00001${combineCode}`

			return resultCode
	}
}

module.exports = new InventoryReceiptController()
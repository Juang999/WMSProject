// modules
const {Op} = require('sequelize')
const {v4: uuidv4} = require('uuid')
const moment = require('moment')
const {Auth, Query} = require('../../helper/helper')

// models
const {
		CcremMstr,
		PtMstr, CodeMstr, 
		LocsMstr,InvcdDet,
		InvctTable, Sequelize
	} = require('../../models')

class SetLocationController {
	findProduct = (req, res) => {
		PtMstr.findOne({
			attributes: [
				'pt_id',
				'pt_code',
				'pt_syslog_code',
				'pt_desc1',
				'pt_color_tag',
				[Sequelize.col('unitmeasure.code_name'), 'pt_unitmeasure'],
				[Sequelize.col('cost_product.invct_cost'), 'invct_cost'],
			],
			include: [
				{
					model: InvctTable,
					as: 'cost_product',
					attributes: [],
					required: true,
					duplicating: false
				}, {
					model: CodeMstr,
					as: 'unitmeasure',
					attributes: [],
					required: true,
					duplicating: false
				}, {
					model: InvcdDet,
					as: 'data_sublocation',
					attributes: [
						[Sequelize.literal(`"data_sublocation->sublocation"."locs_name"`), 'locs_name'],
						['invcd_qty', 'locs_pt_qty'],
						[Sequelize.literal(`"data_sublocation->sublocation"."locs_cap"`), 'locs_cap']
					],
					include: [
						{
							model: LocsMstr,
							as: 'sublocation',
							attributes: []
						}
					]
				}
			],
			where: {
				pt_code: req.params.ptCode
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

	findProductWithSublocation = (req, res) => {
		InvcdDet.findOne({
			attributes: [
				[Sequelize.col('product.pt_id'), 'pt_id'],
				[Sequelize.col('product.pt_code'), 'pt_code'],
				[Sequelize.col('product.pt_syslog_code'), 'pt_syslog_code'],
				[Sequelize.col('product.pt_desc1'), 'pt_desc1'],
				[Sequelize.col('product.pt_color_tag'), 'pt_color_tag'],
				[Sequelize.col('product.unitmeasure.code_name'), 'pt_unitmeasure'],
				[Sequelize.col('product.cost_product.invct_cost'), 'invct_cost'],
				[Sequelize.col('sublocation.locs_name'), 'pt_locs_name'],
				['invcd_qty', 'pt_qty']
			],
			include: [
				{
					model: PtMstr,
					as: 'product',
					attributes: [],
					include: [
						{
							model: InvctTable,
							as: 'cost_product',
							attributes: [],
							required: true,
							duplicating: false
						}, {
							model: CodeMstr,
							as: 'unitmeasure',
							attributes: []
						}
					],
				}, {
					model: LocsMstr,
					as: 'sublocation',
					attributes: []
				}
			],
			where: {
				[Op.and]: [
					Sequelize.where(Sequelize.col('invcd_pt_id'), {
						[Op.eq]: Sequelize.literal(`(SELECT pt_id FROM public.pt_mstr WHERE pt_code = '${req.params.ptCode}')`)
					}),
					Sequelize.where(Sequelize.col('invcd_locs_id'), {
						[Op.eq]: Sequelize.literal(`(SELECT losc_id FROM public.locs_mstr WHERE locs_name = '${req.params.sublName}')`)
					})
				]
			}
		})
		.then(result => {
			console.log(result)
			let code = (result == null) ? 404 : 200
			let status = (result == null) ? 'not found!' : 'success'
			
			res.status(code)
				.json({
					status: status,
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

	updateProductWIthSublocation = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization']);
			let sublocation = await LocsMstr.findOne({attributes: ['losc_id'], where: {locs_name: req.params.sublName}});

			if (req.query.isUpdate == 'Y') {
				await InvcdDet.update({
					invcd_qty: req.body.qty,
					invcd_upd_by: user['usernama'],
					invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
					invcd_type: 'R',
				}, {
					where: {
						[Op.and]: [
							Sequelize.where(Sequelize.col('invcd_pt_id'), {
								[Op.eq]: Sequelize.literal(`(SELECT pt_id FROM public.pt_mstr WHERE pt_code = '${req.params.ptCode}')`)
							}),
							Sequelize.where(Sequelize.col('invcd_locs_id'), {
								[Op.eq]: Sequelize.literal(`(SELECT losc_id FROM public.locs_mstr WHERE locs_name = '${req.params.sublName}')`)
							})
						]
					},
					logging: async (sql, queryCommand) => {
						let value = queryCommand.bind;
		
						await Query.insert(sql, {
							bind: {
								$1: value[0],
								$2: value[1],
								$3: value[2],
								$4: value[3],
								$5: value[4],
								$6: value[5],
							}
						})
					}
				})

				let request = {
					ptCode: req.params.ptCode,
					locId: sublocation['locs_loc_id'],
					locsId: sublocation['losc_id'],
					qty: req.body.qty
				}

				await this.createDataCcremMstr(user, request)
			} else {
				let product = await PtMstr.findOne({attributes: ['pt_id'], where: {pt_code: req.params.ptCode}});
		
				let createProductWithSublocation = await InvcdDet.create({
					invcd_oid: uuidv4(),
					invcd_en_id: req.body.enId,
					invcd_pt_id: product['pt_id'],
					invcd_qty: req.body.qty,
					invcd_rfid: (req.body.rfId) ? req.body.rfId : null,
					invcd_locs_id: sublocation['losc_id'],
					invcd_color_code: '-',
					invcd_remarks: req.body.remarks,
					invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
					invcd_add_by: user['usernama'],
					invcd_weight: 0,
					invcd_type: 'I'
				}, {
					logging: async (sql, queryCommand) => {
						let value = queryCommand.bind;
	
						await Query.insert(sql, {
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
								$11: value[10],
							}
						})
					}
				});

				let request = {
					ptCode: req.params.ptCode,
					locId: sublocation['locs_loc_id'],
					locsId: sublocation['losc_id'],
					qty: req.body.qty
				}

				await this.createDataCcremMstr(user, request)
			}

			res.status(200)
				.json({
					status: 'success',
					data: [1],
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

	createDataCcremMstr = async (user, request) => {
		// find data
		let dataCcrem = await CcremMstr.findOne({
			where: {
				ccrem_pt_id: {
					[Op.eq]: Sequelize.literal(`(SELECT pt_id FROM public.pt_mstr WHERE pt_id = '${request['ptCode']}')`)
				},
				ccrem_locs_id: request['loscId']
			},
			order: [
				['ccrem_add_date', 'DESC']
			]
		})

		// create data in ccrem_mstr
		await CcremMstr.create({
			ccrem_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			ccrem_add_by: user['usernama'],
			ccrem_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			ccrem_type: (dataCcrem == null) ? 'I' : 'R',
			ccrem_pt_id: ptId,
			ccrem_si_id: 1,
			ccrem_loc_id: request['locId'],
			ccrem_locs_id: request['locsId'],
			ccrem_lot_serial: '-',
			ccrem_qty: request['qty'],
			ccrem_um_id: null,
			ccrem_um_conv: null,
			ccrem_qty_real: request['qty'],
			ccrem_cost: null,
			ccrem_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
			ccrem_en_id: request['enId'],
			ccrem_oid: uuidv4(),
			ccrem_qty_old: (dataCcrem == null) ? 0 : dataCcrem['qty']
		}, {
			logging: async (sql, queryCommand) => {
				let value = queryCommand.bind

				await Query.insert(sql, {
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
						$11: value[10],
						$12: value[11],
						$13: value[12],
						$14: value[13],
						$15: value[14],
						$16: value[15],
						$17: value[16],
						$18: value[17],
					}
				})
			}
		})
	}
}

module.exports = new SetLocationController()
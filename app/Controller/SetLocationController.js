// modules
const {Op} = require('sequelize')
const {v4: uuidv4} = require('uuid')
const moment = require('moment')
const {Auth, Query} = require('../../helper/helper')

// models
const {
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

	inputProductAndSublocation = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization']);

			let product = await PtMstr.findOne({attributes: ['pt_id'], where: {pt_code: req.body.ptCode}});
			let sublocation = await LocsMstr.findOne({attributes: ['losc_id'], where: {locs_name: req.body.locsName}});
	
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
				invcd_weight: 0
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

			res.status(200)
				.json({
					status: 'success',
					data: createProductWithSublocation,
					error: null
				});
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					data: null,
					error: error.message
				})
		}
	}

	updateProductWIthSublocation = (req, res) => {
		InvcdDet.update({
			invcd_qty: req.body.qty
		}, {
			where: {
				[Op.and]: [
					Sequelize.where(Sequelize.col('invcd_pt_id'), {
						[Op.eq]: Sequelize.literal(`(SELECT pt_id FROM public.pt_mstr WHERE pt_code = '${req.params.ptCode}')`)
					}),
					Sequelize.where(Sequelize.col('invcd_locs_id'), {
						[Op.eq]: req.params.sublId
					})
				]
			},
			logging: async (sql, queryCommand) => {
				let value = queryCommand.bind;

				await Query.insert(sql, {
					bind: {
						$1: value[0],
						$2: value[1],
						$3: value[2]
					}
				})
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

module.exports = new SetLocationController()
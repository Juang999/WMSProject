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
						[Op.eq]: Sequelize.literal(`(SELECT locs_id FROM public.locs_mstr WHERE locs_name = '${req.params.sublName}')`)
					})
				]
			}
		})
		.then(result => {
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
			let {usernama} = await Auth(req.headers['authorization']);
			let sublocation = await LocsMstr.findOne({attributes: ['locs_loc_id', 'locs_id'], where: {locs_name: req.params.sublName}});

			if (req.query.isUpdate == 'Y') {
				await Promise.all([
					this.updateQuantityProduct({
						updateinvcd_usernama: usernama,
						updateinvcd_qty: req['body']['qty'],
						updateinvcd_ptcode: req['params']['ptCode'],
						updateinvcd_sublname: req['params']['sublName']
					}),
					this.createDataCcremMstr({
						ccrem_qty: req.body.qty,
						ccrem_usernama: usernama,
						ccrem_ptcode: req.params.ptCode,
						ccrem_locsid: sublocation['locs_id'],
						ccrem_locid: sublocation['locs_loc_id'],
					})
				]);
			} else {
				await Promise.all([
					this.createProductWithSublocation({
						inputproduct_request: req.body,
						inputproduct_usernama: usernama,
						inputproduct_ptcode: req.params.ptCode,
						inputproduct_locsid: sublocation['locs_id']
					}),
					this.createDataCcremMstr({
						ccrem_qty: req.body.qty,
						ccrem_usernama: usernama,
						ccrem_ptcode: req.params.ptCode,
						ccrem_locsid: sublocation['locs_id'],
						ccrem_locid: sublocation['locs_loc_id'],
					})
				]);
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

	createProductWithSublocation = async (parameter) => {
		let product = await PtMstr.findOne({attributes: ['pt_id'], where: {pt_code: parameter['inputproduct_ptcode']}});

		await InvcdDet.create({
			invcd_oid: uuidv4(),
			invcd_en_id: parameter['inputproduct_request']['enId'],
			invcd_pt_id: product['dataValues']['ptId'],
			invcd_qty: parameter['inputproduct_request']['qty'],
			invcd_rfid: (parameter['inputproduct_request']['rfId']) ? parameter['inputproduct_request']['rfId'] : null,
			invcd_locs_id: parameter['inputproduct_locsid'],
			invcd_color_code: '-',
			invcd_remarks: parameter['inputproduct_request']['remarks'],
			invcd_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			invcd_add_by: parameter['inputproduct_usernama'],
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
	}

	updateQuantityProduct = async (parameter) => {
		await InvcdDet.update({
			invcd_qty: parameter['updateinvcd_qty'],
			invcd_upd_by: parameter['updateinvcd_usernama'],
			invcd_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			invcd_type: 'R',
		}, {
			where: {
				[Op.and]: [
					Sequelize.where(Sequelize.col('invcd_pt_id'), {
						[Op.eq]: Sequelize.literal(`(SELECT pt_id FROM public.pt_mstr WHERE pt_code = '${parameter['updateinvcd_ptcode']}')`)
					}),
					Sequelize.where(Sequelize.col('invcd_locs_id'), {
						[Op.eq]: Sequelize.literal(`(SELECT locs_id FROM public.locs_mstr WHERE locs_name = '${parameter['updateinvcd_sublname']}')`)
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
	}

	createDataCcremMstr = async (parameter) => {
		// find data
		let {data_product: dataProduct, data_ccrem: dataCcrem} = await this.GET_DATA_PRODUCT_AND_CCREM({
			ccrem_ptcode: parameter['ccrem_ptcode'],
			ccrem_locsid: parameter['ccrem_locsid']
		})

		// create data in ccrem_mstr
		await CcremMstr.create({
			ccrem_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			ccrem_add_by: parameter['ccrem_usernama'],
			ccrem_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			ccrem_type: (dataCcrem == null) ? 'I' : 'R',
			ccrem_pt_id: dataProduct['pt_id'],
			ccrem_si_id: 992,
			ccrem_loc_id: parameter['ccrem_locid'],
			ccrem_locs_id: parameter['ccrem_locsid'],
			ccrem_lot_serial: '-',
			ccrem_qty: parameter['ccrem_qty'],
			ccrem_um_id: null,
			ccrem_um_conv: null,
			ccrem_qty_real: parameter['ccrem_qty'],
			ccrem_cost: null,
			ccrem_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
			ccrem_en_id: dataProduct['dataValues']['pt_en_id'],
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

	GET_DATA_PRODUCT_AND_CCREM = async (parameter) => {
		let dataProduct = await PtMstr.findOne({where: {pt_code: parameter['ccrem_ptcode']}})
		let dataCcrem = await CcremMstr.findOne({
			where: {
				ccrem_pt_id: dataProduct['dataValues']['pt_id'],
				ccrem_locs_id: parameter['ccrem_locsid']
			},
			order: [
				['ccrem_add_date', 'DESC']
			]
		})
		
		return {
			data_product: dataProduct,
			data_ccrem: dataCcrem
		}
	}
}

module.exports = new SetLocationController()
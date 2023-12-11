// packages
const {Query, Auth, Page} = require('../../helper/helper')
const moment = require('moment')
const {Op} = require('sequelize')
const {v4: uuidv4} = require('uuid')

// models
const {
	LocMstr,
	PtMstr, InvcdDet,
	LocsMstr, LocsTemporary, 
	Sequelize, sequelize
} = require('../../models')

class SublocationController {
	index = async (req, res) => {
		try {
			let dataLocs = await LocsMstr.findAll({
						attributes: [
								'locs_id', 
								'locs_name',
								'locs_remarks',
								'locs_active',
								'locs_cap',
								'locs_subcat_id',
							],
						where: {
							locs_id: {
								[Op.and]: [
									{
										[Op.notIn]: Sequelize.literal(`(SELECT locst_locs_id FROM public.locs_temporary)`)
									},
									{
										[Op.notIn]: Sequelize.literal(`(SELECT invcd_locs_id FROM public.invcd_det)`)
									}
								]
							},
							locs_name: {
								[Op.iLike]: (req.query.colname) ? `%${req.query.colname}%` : '%%'
							},
							locs_active: 'Y',
							locs_loc_id: req.query.loc
						},
						order: [
								['locs_id', 'ASC']
							]
					})		

			res.status(200)
					.json({
						status: 'success',
						data: dataLocs,
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

	store = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization'])

			let generateLocsId = await this.generateLocsId(user)

			let createSubLocation = await LocsMstr.create({
				locs_oid: uuidv4(),
				locs_en_id: req.body.entityId,
				locs_id: generateLocsId['dataValues']['locs_id'] + 1,
				locs_loc_id: req.body.locId,
				locs_add_by: user['usernama'],
				locs_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				locs_name: req.body.subLocationName,
				locs_remarks: req.body.subLocationRemarks,
				locs_active: 'Y',
				locs_cap: req.body.capacity,
				locs_subcat_id: req.body.subCategory,
			}, {
				logging: async (sql, queryCommand) => {
					let values = queryCommand.bind 

						await Query.insert(sql, {
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
								$11: values[10],
								$12: values[11],
							}
						})
				}
			})

			res.status(200)
				.json({
					status: 'success',
					data: createSubLocation,
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

	inputTemporary = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization'])

			let result = await LocsTemporary.create({
				locst_oid: uuidv4(),
				locst_locs_id: req.body.locsId,
				locst_type: req.body.locsType,
				locst_user_id: user['userid'],
			})

			res.status(200)
				.json({
					status: 'success',
					data: result,
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

	inputCapacity = (req, res) => {
		LocsMstr.update({
			locs_cap: req.body.capacity
		}, {
			where: {
				locs_id: req.params.locs_id
			},
			logging: async (sql, queryCommand) => {
				let values = queryCommand.bind 

				await Query.insert(sql, {
					bind: {
						$1: values[0],
						$2: values[1]
					}
				})
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to input capacity',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to input capacity',
					error: err.message
				})
		})
	}

	generateLocsId = async (users) => {
		let getSubLocation = await LocsMstr.findOne({
			order: [
					['locs_id', 'DESC']
				]
		})

		return (getSubLocation) 
				? getSubLocation 
				: await LocsMstr.create({
					locs_oid: uuidv4(),
					locs_en_id: 1,
					locs_id: 1,
					locs_loc_id: 10001,
					locs_add_by: users['usernama'],
					locs_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
					locs_name: '-',
					locs_remarks: '-',
					locs_active: 'N',
					locs_cap: 0,
					locs_subcat_id: 99258
				}, {
					logging: async (sql, queryCommand) => {
						let values = queryCommand.bind 

						await Query.insert(sql, {
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
								$11: values[10],
							}
						})
					}
				})
	}

	eraseData = async (headerOid) => {
		await LocsTemporary.destroy({
			where: {
				locst_header_oid: headerOid,
			}
		})
	}

	show = (req, res) => {
		LocsMstr.findOne({
			attributes: [
				'locs_id',
				'locs_name',
				'locs_cap'
			],
			include: [
				{
					model: InvcdDet,
					as: 'data_product',
					attributes: [
						[Sequelize.literal(`"data_product->product"."pt_desc1"`), 'pt_desc1'],
						[Sequelize.literal(`"data_product->product"."pt_en_id"`), 'pt_en_id'],
						[Sequelize.literal(`"data_product->product"."pt_code"`), 'pt_code'],
						['invcd_qty', 'pt_qty'],
					],
					include: [
						{
							model: PtMstr,
							as: 'product',
							attributes: []
						}
					]
				}
			],
			where: {
				locs_name: req.params.sublName
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

	updateSublocation (req, res) {
		LocsTemporary.update({
			locst_locs_id: req.body.locsId
		}, {
			where: {
				locs_oid: req.params.locstOid
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

	getAllSublocation (req, res) {
		let checkQueryParamPage = (req.query.page) ? req.query.page : 1

		let locsName = (req.query.locs_name) ? `%${req.query.locs_name}%` : `%%`

		LocsMstr.findAll({
			attributes: [
				'locs_id',
				[Sequelize.col('location.loc_desc'), 'locs_loc_desc'],
				'locs_name',
				"locs_remarks",
				"locs_active",
				"locs_cap",
				"locs_subcat_id",
			],
			include: [
				{
					model: LocMstr,
					as: 'location',
					required: true,
					attributes: []
				},
				{
					model: InvcdDet,
					as: 'data_product',
					attributes: [
						'invcd_oid',
						[Sequelize.literal(`"data_product->product"."pt_id"`), 'invcd_pt_id'],
						[Sequelize.literal(`"data_product->product"."pt_desc1"`), 'invcd_pt_desc'],
						[Sequelize.literal(`"data_product->product"."pt_code"`), 'invcd_pt_code'],
						'invcd_qty'
					],
					include: [
						{
							model: PtMstr,
							as: 'product',
							attributes: []
						}
					]
				}
			],
			where: {
				locs_name: {
					[Op.iLike]: locsName
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

	getAllGITSublocation (req, res) {
		LocsMstr.findAll({
			attributes: ['locs_id', 'locs_name'],
			where: {
				locs_loc_id: 1000282
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

module.exports = new SublocationController()
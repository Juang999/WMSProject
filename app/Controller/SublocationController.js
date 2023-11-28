// packages
const {Query, Auth} = require('../../helper/helper')
const moment = require('moment')
const {Op} = require('sequelize')
const {v4: uuidv4} = require('uuid')

// models
const {
	PtMstr, InvcdDet,
	LocsMstr, LocsTemporary, 
	Sequelize, sequelize
} = require('../../models')

class SublocationController {
	index = async (req, res) => {
		try {
			let dataLocs = await LocsMstr.findAll({
						attributes: [
								'losc_id', 
								'locs_name',
								'locs_remarks',
								'locs_active',
								'locs_cap',
								'locs_subcat_id',
								'locs_type'
							],
						where: {
							losc_id: {
								[Op.notIn]: await this.getId()
							},
							locs_name: {
								[Op.iLike]: (req.query.colname) ? `%${req.query.colname}%` : '%%'
							},
							locs_active: 'Y',
							locs_loc_id: req.query.loc
						},
						order: [
								['losc_id', 'ASC']
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
				locs_en_id: req.body.entityId,
				losc_id: generateLocsId['dataValues']['losc_id'] + 1,
				locs_loc_id: req.body.locId,
				locs_add_by: user['usernama'],
				locs_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				locs_name: req.body.subLocationName,
				locs_remarks: req.body.subLocationRemarks,
				locs_active: 'Y',
				locs_cap: req.body.capacity,
				locs_subcat_id: req.body.subCategory,
				locs_type: req.body.type
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
				losc_id: req.params.losc_id
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

	getId = async () => {
		let arr1 = await this.getLocsIdFromTemporaryTable()
		let arr2 = await this.getLocsIdFromInvcdDetTable()

		let concatArray = arr1.concat(arr2)

		return concatArray
	}

	getLocsIdFromTemporaryTable = async () => {
		let locsIdInLocsTemporaryTable = await LocsTemporary.findAll({attributes: ['locst_locs_id']})

		let arr = []

		for (let data of locsIdInLocsTemporaryTable) {
			arr.push(data['locst_locs_id'])
		}

		return arr
	}

	getLocsIdFromInvcdDetTable = async () => {
		let locsIdInInvcdDetTable = await InvcdDet.findAll({attributes: ['invcd_locs_id']})

		let arr = []

		for (let data of locsIdInInvcdDetTable) {
			arr.push(data['locst_locs_id'])
		}

		return arr
	}

	generateLocsId = async (users) => {
		let getSubLocation = await LocsMstr.findOne({
			order: [
					['losc_id', 'DESC']
				]
		})

		return (getSubLocation) 
				? getSubLocation 
				: await LocsMstr.create({
					locs_en_id: 1,
					losc_id: 1,
					locs_loc_id: 10001,
					locs_add_by: users['usernama'],
					locs_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
					locs_name: '-',
					locs_remarks: '-',
					locs_active: 'N',
					locs_cap: 0,
					locs_subcat_id: 99258,
					locs_type: 991388
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

	eraseData = async (user_id, type) => {
		await LocsTemporary.destroy({
			where: {
				locst_type: type,
				locst_user_id: user_id
			}
		})
	}

	show = (req, res) => {
		LocsMstr.findOne({
			attributes: [
				['losc_id', 'locs_id'],
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
}

module.exports = new SublocationController()
// packages
const {Query, Auth} = require('../../helper/helper')
const moment = require('moment')
const {Op} = require('sequelize')

// models
const {LocsMstr, Sequelize, sequelize} = require('../../models')

class SublocationController {
	index = (req, res) => {
		LocsMstr.findAll({
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
					[Op.notIn]: Sequelize.literal(`(SELECT invcd_locs_id FROM public.invcd_det)`)
				},
				locs_name: {
					[Op.iLike]: (req.query.colname) ? `%${req.query.colname}%` : '%%'
				},
				locs_active: 'Y'
			},
			order: [
					['losc_id', 'ASC']
				]
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
				console.log(err.stack)
				res.status(400)
					.json({
						status: 'failed',
						data: null,
						error: err.message
					})
			})
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
}
	
module.exports = new SublocationController()
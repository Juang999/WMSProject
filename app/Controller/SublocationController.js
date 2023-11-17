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
				losc_id: generateLocsId['losc_id'] + 1,
				locs_add_by: user['usernama'],
				locs_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				locs_name: req.body.subLocationName,
				locs_remarks: req.body.subLocationRemarks,
				locs_active: 'Y',
				locs_cap: req.body.capacity,
				locs_subcat_id: req.body.subCategory,
				locs_type: req.body.type
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

	generateLocsId = async (users) => {
		let subLocation = await LocsMstr.findOrCreate({
							where: {
								losc_id: {
									[Op.eq]: Sequelize.literal(`(SELECT losc_id FROM public.locs_mstr ORDER BY locs_add_date DESC LIMIT 1)`)
								}
							},
							defaults: {
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
							} ,
							order: [
									['locs_add_date', 'DESC']
								]
						})

		return subLocation
	}
}
	
module.exports = new SublocationController()
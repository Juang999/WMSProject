// package
const {Op} = require('sequelize')

// model
const {AcMstr, EnMstr, LocMstr, PtnrMstr, SiMstr, PtnrgGrp, Sequelize} = require('../../models')

class MasterController {
	getLocation = (req, res) => {
		LocMstr.findAll({
			attributes: ['loc_id', 'loc_desc'],
			order: [
					['loc_id', 'asc']
				]	
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get data location',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get data location',
					error: err.message
				})
		})
	}

	getEntity = (req, res) => {
		EnMstr.findAll({
			attributes: ['en_id', 'en_desc'],
			where: {
				en_id: {
					[Op.not]: 0
				}
			},
			order: [['en_id', 'asc']]
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get entity',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get entity',
					error: err.message
				})
		})
	}

	getAccount = (req, res) => {
		AcMstr.findAll({
			attributes: ['ac_id', 'ac_code', 'ac_name']
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get account',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get account',
					error: err.message
				})
		})
	}

	getSite = (req, res) => {
		SiMstr.findAll({
			attributes: ['si_id', 'si_code', 'si_desc']	
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get site',
					result: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get site',
					error: err.message
				})
		})
	}

	getPartner = (req, res) => {
		PtnrMstr.findAll({
			attributes: [
					'ptnr_id', 
					'ptnr_name',
					[Sequelize.col('group_partner.ptnrg_name'), 'group_name']
				],
			include: [
					{
						model: PtnrgGrp,
						as: 'group_partner',
						attributes: []
					}
				],
			where: {
				ptnr_is_emp: {
					[Op.not]: 'Y'
				}
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get partner',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get partner',
					error: err.message
				})
		})
	}
}

module.exports = new MasterController()
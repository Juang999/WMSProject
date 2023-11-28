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

class ProductController {
	searchProduct = (req, res) => {
		PtMstr.findOne({
			attributes: [
					'pt_id', 
					'pt_en_id',
					'pt_code', 
					'pt_syslog_code', 
					'pt_desc1',
					[Sequelize.literal("CASE WHEN pt_color_tag IS NOT NULL THEN pt_color_tag ELSE '-' END"), 'pt_color_tag'],
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
						attributes: []
					}
				],
			where: {
				[Op.or]: [
						{pt_code: req.params.pt_code},
						{pt_syslog_code: req.params.pt_code},
					]
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'product found!',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'error!',
					data: err.message
				})
		})
	}
}

module.exports = new ProductController()
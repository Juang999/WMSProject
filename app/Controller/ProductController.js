// modules
const {Op} = require('sequelize')

// models
const {PtMstr, InvctTable, Sequelize} = require('../../models')

class ProductController {
	searchProduct = (req, res) => {
		PtMstr.findOne({
			attributes: [
					'pt_id', 
					'pt_code', 
					'pt_syslog_code', 
					'pt_desc1', 
					'pt_color_tag',
					[Sequelize.col('cost_product.invct_cost'), 'invct_cost']
				],
			include: [
					{
						model: InvctTable,
						as: 'cost_product',
						attributes: [],
						required: true,
						duplicating: false
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
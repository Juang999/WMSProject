// modules
const {Op} = require('sequelize');
const moment = require('moment');
const { info, error: errorLog } = require('../../helper/Logging');
const { ProductService } = require('../Services/ServiceContainer');

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

	getProductsQuantity = async (req, res) => {
		try {
			let year = req.query.release_year || '';
			let productName = req.query.product || '';
			let categoryName = req.query.category || '';
			let productCode = req.query.product_code || '';
			let subCategoryName = req.query.subcategory || '';

			let result = await ProductService.getProductsQuantity(productCode, productName, categoryName, subCategoryName, year);

			res.status(200)
				.json({
					status: 'success',
					message: 'product found!',
					data: result,
					error: null
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					message: 'error!',
					data: null,
					error: error.message
				})
		}
	}

	getProductForSalesQuotation = async ( req, res ) => {
		try {
			let conditions = {
				entity_id: req.params.entity_id,
				pricelist_id: req.query.pricelist_id,
				area_id: req.query.area_id,
				location_id: req.query.location_id,
				payment_type_id: req.query.payment_type_id
			}

			let result = await ProductService.getProductSalesQuotation( conditions );

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET PRODUCT FOR SALES QUOTATION', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getProductConsigmentSalesOrder = async ( req, res ) => {
		try {
			let conditions = {
				entity_id: req.params.entity_id,
				location_name: (req.query.location) ? req.query.location : '',
				description1: (req.query.description1) ? req.query.description1 : '',
				pricelist_id: req.query.pricelist_id,
				area_id: req.query.area_id,
				payment_type_id: req.query.payment_type_id
			};

			let result = await ProductService.getConsigmentProduct(conditions);

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET PRODUCT', error.message)

			res.status(500)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error'
				})
		}
	}

	getProductForSalesQuotation = async ( req, res ) => {
		try {
			let conditions = {
				entity_id: req.params.entity_id,
				pricelist_id: req.query.pricelist_id,
				area_id: req.query.area_id,
				location_id: req.query.location_id,
				payment_type_id: req.query.payment_type_id
			}

			let result = await ProductService.getProductSalesQuotation( conditions );

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET PRODUCT FOR SALES QUOTATION', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}
}

module.exports = new ProductController()
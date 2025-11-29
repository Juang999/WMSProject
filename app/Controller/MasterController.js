// package
const {Op} = require('sequelize')

// model
const {
	LocMstr, 
	AcMstr, CodeMstr, 
	PtnrMstr, SiMstr, 
	PtnrgGrp, Sequelize
} = require('../../models')

const { MasterService, LocationService } = require('../Services/ServiceContainer');
const {info, error: errorLog} = require('../../helper/Logging');

/*
* MasterController is simillar with SublocationController, the different is
* MasterController only accomodate method that don't need CREATE, UPDATE,
* and DELETE Method.

* function name is very clear, so I thought that you don't need any explain ^-^
*/

class MasterController {
	getSite = async ( req, res ) => {
		try {
			let result = await MasterService.getSite();

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null,
				})
		} catch (error) {
			await errorLog('GET SITE', error.message);

			res.status(400)
				.json({
					status: 'error',
					message: 'failed',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getEntity = (req, res) => {
		MasterService.getEntity()
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

	getCategory = (req, res) => {
		MasterService.getCategory()
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		})
		.catch(err => {
			errorLog('GET CATEGORY', err.message)

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: err.message
				})
		})
	}

	getAccount = async (req, res) => {
		try {
			let result = await MasterService.retrieveAccount();

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				});
		} catch (error) {
			await errorLog('GET ACCOUNT', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getSubAccount = async ( req, res ) => {
		try {
			let result = await MasterService.retrieveSubAccount();

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET SUB ACCOUNT', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getCostCenter = async ( req, res ) => {
	try {
		let result = await MasterService.retrieveCostCenter();

		res.status(200)
			.json({
				status: 'success',
				message: 'ok',
				data: result,
				error: null
			})
	} catch (error) {
		await errorLog('GET SUB ACCOUNT', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
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

	getSublocation = (req, res) => {
		let locId = req.params.location_id;
		let search = (req.query.search) ? req.query.search : '';

		MasterService.getSublocation(locId, search)
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					dataa: result,
					error: null
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: err.message
				})
		})
	}

	getSublocationType = (req, res) => {
		CodeMstr.findAll({
			attributes: ['code_id', 'code_field', 'code_name'],
			where: {
				code_field: 'type_sublocation',
				code_active: {
					[Op.not]: 'N'
				}
			},
			order: [
					['code_default', 'DESC']
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
			res.status(400)
				.json({
					status: 'failed',
					data: null,
					error: err.message
				})
		})
	}

	getLocationSalesQuotation = async ( req, res ) => {
		try {
			let entityId = req.params.entity_id;
			let locationName = req.query.location_name || '';

			let result = await LocationService.getSimpleDataLocation( entityId, locationName );

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET LOCATION SALES QUOTATION', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getAreaPriceListt = async ( req, res ) => {
		try {
			let result = await MasterService.retrieveAreaPriceList();

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				});
		} catch (error) {
			await errorLog(`GET AREA PRICELIST`, error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				});
		}
	}

	getPaymentMethod = async ( req, res ) => {
		try {
			let codeField = 'payment_methode';

			let result = await MasterService.retrieveDataCodeMstrByCodeField( codeField );

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET PAYMENT METHOD', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getPaymentType = async ( req, res ) => {
		try {
			let codeField = 'payment_type';

			let result = await MasterService.retrieveDataCodeMstrByCodeField( codeField );

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET PAYMENT METHOD', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getCreditTerms = async ( req, res ) => {
		try {
			let codeField = 'creditterms_mstr';

			let result = await MasterService.retrieveDataCodeMstrByCodeField( codeField );

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET PAYMENT METHOD', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getSalesProgramName = async ( req, res ) => {
		try {
			let salesProgramName = req.query.sales_program_name || '';

			let result = await MasterService.retrieveSalesProgram( salesProgramName );

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET SALES PROGRAM', error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error'
				})
		}
	}

	getCurrency = async ( req, res ) => {
		try {
			let result = await MasterService.retrieveCurrency();

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				});
		} catch (error) {
			await errorLog('GET CURRENCY', error.message);
			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				});
		}
	}

	getApproval = async ( req, res ) => {
		try {
			let result = await MasterService.retrieveDataApproval();

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			res.status(500)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getBank = async ( req, res ) => {
		try {
			let result = await MasterService.retrieveDataBank();

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog('GET DATA BANK', error.message)

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

module.exports = new MasterController()
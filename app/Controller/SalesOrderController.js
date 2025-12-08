// module
const {Auth, Query} = require('../../helper/helper')
const moment = require('moment')
const {Op} = require('sequelize')
const {InventoryService, SalesOrderService, SalesQuotationService} = require('../Services/ServiceContainer')
const {v4: uuidv4} = require('uuid');
const { error: errorLog } = require('../../helper/Logging');
// model
const {SoMstr, SodDet, PtMstr, Sequelize, PtnrMstr, LocMstr, sequelize} = require('../../models')
const TransactionCode = require('../../helper/TransactionCode');
const Bilangan = require('../../helper/Bilangan');
const { bookSerials, bookInventory, releaseSerials, releaseInventory } = require('./SalesQuotationController');
const { isUUID } = require('validator');

class SalesOrderController {
	detailSalesOrder = (req, res) => {
		SoMstr.findOne({
			attributes: [
				['so_oid', 'oid'], 
				['so_code', 'code'], 
				['so_add_by', 'add_by'], 
				['so_add_date', 'add_date'], 
				['so_upd_by', 'upd_by'], 
				['so_upd_date', 'upd_date'],
				[Sequelize.literal('"buyer"."ptnr_name"'), 'customer'],
			],
			include: [
					{
						model: PtnrMstr,
						as: 'buyer',
						attributes: [],
						required: true,
						duplicating: false
					}, {
						model: SodDet,
						as: 'detail_sales_order',
						attributes: [
								['sod_oid', 'detail_oid'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_code"'), 'detail_pt_code'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_desc1"'), 'detail_pt_desc1'],
								['sod_qty', 'detail_qty'],
								['sod_qty_checked', 'detail_qty_checked'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_syslog_code"'), 'detail_syslog_code'],
							],
						include: [
								{
									model: PtMstr,
									as: 'detail_product',
									attributes: []
								}
							]
					}
				],
			where: {
				so_code: req.params.so_code
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get data sales order',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get data sales order',
					error: err.message
				})
		})
	}

	getHistory = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization'])

			let dataSalesOrder = await SoMstr.findAll({
				attributes: [
						['so_oid', 'oid'], 
						['so_code', 'code'], 
						['so_add_by', 'add_by'], 
						['so_add_date', 'add_date'], 
						['so_upd_by', 'upd_by'], 
						['so_upd_date', 'upd_date']
					],
				include: [
						{
							model: SodDet,
							as: 'detail_sales_order',
							attributes: [
									['sod_oid', 'detail_oid'],
									[Sequelize.literal('"detail_sales_order->detail_product"."pt_desc1"'), 'detail_pt_desc1'],
									['sod_qty', 'detail_qty'],
									['sod_qty_checked', 'detail_qty_checked'],
								],
							include: [
									{
										model: PtMstr,
										as: 'detail_product',
										attributes: []
									}
								]
						}
					],
					where: {
						so_oid: {
							[Op.in]: Sequelize.literal(`(SELECT sod_so_oid FROM public.sod_det WHERE sod_upd_by = '${user['usernama']}')`)
						}
					}
			})

			res.status(200)
				.json({
					status: 'success',
					message: 'success to get',
					data: dataSalesOrder
				})
		} catch (err) {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get data history',
					error: error.message
				})
		}
	}

	getSalesOrderToday = (req, res) => {
		let startDate = (req.query.start_date) ? moment(req.query.start_date).format('YYYY-MM-DD 00:00:00') : moment().format('YYYY-MM-DD HH:mm:ss')
		let endDate = (req.query.end_date) ? moment(req.query.end_date).format('YYYY-MM-DD 23:59:59') : moment().format('YYYY-MM-DD 23:59:59')

		SoMstr.findAll({
			attributes: [
				['so_oid', 'oid'], 
				['so_code', 'code'], 
				['so_add_by', 'add_by'], 
				['so_add_date', 'add_date'], 
				['so_upd_by', 'upd_by'], 
				['so_upd_date', 'upd_date'],
				[Sequelize.literal('"buyer"."ptnr_name"'), 'customer'],
				],
			include: [
					{
						model: PtnrMstr,
						as: 'buyer',
						attributes: [],
						required: true,
						duplicating: false
					}, {
						model: SodDet,
						as: 'detail_sales_order',
						attributes: [
								['sod_oid', 'detail_oid'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_code"'), 'detail_pt_code'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_desc1"'), 'detail_pt_desc1'],
								['sod_qty', 'detail_qty'],
								['sod_qty_checked', 'detail_qty_checked'],
								[Sequelize.literal('"detail_sales_order->detail_product"."pt_syslog_code"'), 'detail_syslog_code'],
							],
						include: [
								{
									model: PtMstr,
									as: 'detail_product',
									attributes: []
								}
							]
					}
				],
			where: {
				so_upd_by: {
					[Op.is]: null
				},
				so_add_date: {
					[Op.between]: [startDate, endDate]
				}
			}
		})
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get data sales order',
					data: result
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get data sales order',
					error: err.message
				})
		})
	}

	updateQtySalesOrder = async (req, res) => {
		try {
			let user = await Auth(req.headers['authorization'])
			let detailQtyChecked = JSON.parse(req.body.products)

			for (let dataQtyChecked of detailQtyChecked) {
				await SodDet.update({
					sod_upd_by: user['usernama'],
					sod_upd_date: moment().format('YYYY-MM-DD HH:mm:ss'),
					sod_qty_checked: dataQtyChecked['qtyChecked']
				}, {
					where: {
						sod_oid: dataQtyChecked['sod_oid']
					}, 
					logging: async (sql, queryCommand) => {
						let value = queryCommand.bind

						await Query.insert(sql, {
							bind: {
								$1: value[0],
								$2: value[1],
								$3: value[2],
								$4: value[3],
							}
						})
					}
				})
			}

			res.status(200)
				.json({
					status: 'success',
					message: 'success to update SO'	
				})
		} catch (error) {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to update SO',
					error: error.message
				})
		}
	}

	scanOut = (req, res) => {
		let {serial_number, transaction_oid, entity_id} = req.body;

		sequelize.transaction(async t => {
			let dataSerial = await InventoryService.findSerialNumber(serial_number, t);

			if (!dataSerial) {
				return this.returnResponse(300, 'rejected', 'serial not found', null)
			}

			if (dataSerial.dataValues.qty == 0) {
				return this.returnResponse(300, 'rejected', 'serial has scanned out!', null)
			}

			if (dataSerial.dataValues.entity_id != entity_id) {
				return this.returnResponse(300, 'rejected', 'serial not belong to this entity', null)
			}

			if (dataSerial.dataValues.uniq == null || dataSerial.dataValues.invcd_locs_id == null) {
				return this.returnResponse(300, 'rejected', 'Unregistered serial', null)
			}

			let historySerial = {
				invcdh_oid: uuidv4(),
				invcdh_dom_id: dataSerial.dataValues.invcd_dom_id,
				invcdh_en_id: dataSerial.dataValues.invcd_en_id,
				invcdh_pt_id: dataSerial.dataValues.invcd_pt_id,
				invcdh_loc_from_id: dataSerial.dataValues.invcd_loc_id,
				invcdh_locs_from_id: dataSerial.dataValues.invcd_locs_id,
				invcdh_qrbarcode: (dataSerial.dataValues.uniq != null) ?dataSerial.dataValues.uniq : dataSerial.dataValues.alias_uniq,
				invcdh_status: 'scanned out!',
				invcdh_remarks: `scanned out reference to oid: ${transaction_oid}`,
				invcdh_created_by: 'system',
				invcdh_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
			}

			await Promise.all([
				InventoryService.scanoutSerial(dataSerial.dataValues.invcd_oid, transaction_oid, t),
				InventoryService.createHistory([historySerial], t)
			])

			return this.returnResponse(200, 'success', 'success to scan out serial', null)
		})
		.then(result => {
			res.status(result.code)
				.json(result.json)
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to scan out serial',
					data: null,
					error: err.message
				})
		})
	}

	getScannedOutSerial = (req, res) => {
		InventoryService.getScannedOutSerial(req.params.transaction_oid)
		.then(result => {
			res.status(200)
				.json({
					status: 'success',
					message: 'success to get scanned out serial',
					data: result,
					error: null
				})
		})
		.catch(err => {
			res.status(400)
				.json({
					status: 'failed',
					message: 'failed to get scanned out serial',
					data: null,
					error: err.message
				})
		})
	}

	getHeaderSalesOrder = async ( req, res ) => {
		try {
			let startDate = req.query.start_date || moment().format('YYYY-MM-DD');
			let endDate = req.query.end_date || moment().format('YYYY-MM-DD');
			let soCode = req.query.so_code || '';

			let result = await SalesOrderService.retrieveAllSalesOrder({
				start_date: startDate,
				end_date: endDate,
				so_code: soCode
			});

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: result,
					error: null
				})
		} catch (error) {
			await errorLog(`'GET ALL HEADER SALES ORDER`, error.message);

			res.status(400)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	getDetailSalesOrder = async ( req, res ) => {
		try {
			let headerSalesOrderOid = req.params.header_sales_order_oid;

			let [data_detail, data_customer, data_account_receivable_ledger, data_assembly] = await Promise.all([
				SalesOrderService.retrieveDetailProductSalesOrder(headerSalesOrderOid),
				SalesOrderService.retrieveDataCustomer(headerSalesOrderOid),
				SalesOrderService.retrieveAccountReceivableLedger(headerSalesOrderOid),
				SalesOrderService.retrieveDetailAssembly(headerSalesOrderOid)
			]);

			res.status(200)
				.json({
					status: 'success',
					message: 'ok',
					data: {data_detail, data_customer, data_account_receivable_ledger, data_assembly},
					error: null
				})
		} catch (error) {
			await errorLog(`GET DETAIL SALES ORDER`, error.message);

			res.status(500)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	createSalesOrder = async ( req, res ) => {
		let transaction = await sequelize.transaction();
		let token = req.headers['authorization'].split(" ")[1];
		let dataUser = Auth.user(token);

		try {
			let sequenceSalesOrder = await SalesOrderService.retrieveTotalSalesOrderInAMonth();
			let dataDetail = JSON.parse(req.body.detail_sales_order);
			let totalPrice = this.sumTotalPrice(dataDetail);

			if (isUUID(req.body.sales_quotation_oid, 4) == true && req.body.is_consigment == 'Y') {
				res.status(400)
					.json({
						status: 'failed',
						message: 'Sales Order yang memiliki referensi Sales Quotation tidak bisa dijadikan konsinyasi',
						data: null,
						error: null
					})

				return;
			}

			let headerSalesOrder = {
				sales_order_oid: uuidv4(),
				entity_id: req.body.entity_id,
				reference_sq_code: req.body.sales_quotation_code || null,
				reference_sq_oid: req.body.sales_quotation_oid || null,
				so_code: await TransactionCode.generate('SO', req.body.entity_id, sequenceSalesOrder),
				customer_id: req.body.customer_id,
				date: req.body.date,
				credit_term_id: req.body.credit_term_id,
				sales_person_id: req.body.sales_person_id,
				pricelist_id: req.body.pricelist_id,
				payment_type_id: req.body.payment_type,
				payment_method_id: req.body.payment_method,
				account_id: req.body.account_id,
				subaccount_id: req.body.subaccount_id,
				cost_center_id: req.body.cost_center_id,
				total: totalPrice,
				payment_date: req.body.payment_date,
				remarks: req.body.remarks,
				currency_id: req.body.currency_id,
				total_ppn: req.body.total_ppn,
				total_pph: req.body.total_pph,
				payment: req.body.payment,
				exchange_rate: req.body.exchange_rate,
				is_consigment: req.body.is_consigment,
				terbilang: Bilangan.parse(totalPrice),
				bank_id: req.body.bank_id,
				preorder_code: (req.body.purchase_order_code == null || req.body.purchase_order_code == '' || req.body.purchase_order_code == '-') ? null : req.body.purchase_order_code,
				preorder_oid: (req.body.purchase_order_oid == null || req.body.purchase_order_oid == '' || req.body.purchase_order_oid == '-') ? null : req.body.purchase_order_oid,
				is_package: req.body.is_package,
				shipping_charges: req.body.shipping_charges || null,
				is_booking: req.body.is_booking,
				origin_location_id: (req.body.is_consigment == 'Y') ? null : req.body.origin_location_id,
				destination_location_id: (req.body.is_consigment == 'Y') ? null : req.body.destination_location_id,
				git_location_id: (req.body.is_consigment == 'Y') ? null : req.body.git_location_id,
				book_start_date: req.body.book_start_date,
				book_end_date: req.body.book_end_date,
				midtrans_invoice_number: req.body.invoice_number || null
			}

			let dataDetailSalesOrder = await this.generateDetailSalesOrder(dataDetail, headerSalesOrder, dataUser, transaction);

			await SalesOrderService.inputHeaderSalesOrder(headerSalesOrder, dataUser, transaction);
			await SalesOrderService.inputDetailSalesOrder(dataDetailSalesOrder, transaction);

			if (isUUID(req.body.sales_quotation_oid, 4) == true && req.body.is_consigment == 'N') {
				await SalesQuotationService.updateDataHeaderSq(req.body.sales_quotation_oid, dataUser, {
					transaction_status: 'C',
					close_date: moment().format('YYYY-MM-DD'),
					payment_date: moment().format('YYYY-MM-DD')
				}, transaction);
			}

			await transaction.commit();
			res.status(200)
				.json({
					status: 'success',
					message: 'created',
					data: 'hello world',
					error: null
				})
		} catch (error) {
			await transaction.rollback();
			await errorLog('CREATE SALES ORDER', error.message)

			res.status(500)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	cancelSalesOrder = async ( req, res ) => {
		let transaction = await sequelize.transaction();
		let token = req.headers['authorization'].split(" ")[1];
		let dataUser = Auth.user(token);
		let headerSalesOrderOid = req.params.header_sales_order_oid;

		try {
			let [dataHeader, dataDetail] = await Promise.all([
				SalesOrderService.findDataHeaderSalesOrder( headerSalesOrderOid ),
				SalesOrderService.retrieveDetailProductSalesOrder(headerSalesOrderOid)
			]);

			if (dataHeader.dataValues.so_trans_id == 'C') {
				await transaction.rollback()

				return res.status(400)
					.json({
						status: 'failed',
						message: 'Sales Order has been closed',
						data: null,
						error: 'Sales Order has been closed'
					})
			}

			if (dataHeader.dataValues.so_trans_id == 'X') {
				await transaction.rollback()

				return res.status(400)
					.json({
						status: 'failed',
						message: 'Sales Order has been canceled',
						data: null,
						error: 'Sales Order has been canceled'
					})
			}

			await this.releaseQty(dataDetail, transaction);
			await SalesOrderService.updateHeaderSalesOrder({
				username: dataUser.usernama,
				updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
				transaction_id: 'X'
			}, headerSalesOrderOid, transaction);

			await transaction.commit();

			res.status(200)
				.json({
					status: 'success',
					message: 'SO has been canceled',
					data: true,
					error: null
				})
		} catch (error) {
			await transaction.rollback();
			await errorLog('CANCEL SALES ORDER', error.message);

			res.status(500)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				})
		}
	}

	deleteDetailSalesOrder = async ( req, res ) => {
		let transaction = await sequelize.transaction();

		try {
			let dataDetailSalesOrder = await SalesOrderService.findDetailSalesOrder( req.params.detail_sales_order_oid );

			if (!dataDetailSalesOrder) {
				return res.status(404)
					.json({
						status: 'not found',
						message: 'not found',
						data: null,
						error: 'not found'
					})
			}

			if (dataDetailSalesOrder.dataValues.transaction_id == 'C' || dataDetailSalesOrder.dataValues.transaction_id == 'X') {
				return res.status(400)
						.json({
							status: 'failed',
							message: 'cannot delete detail sales order from closed or canceled sales order',
							data: null,
							error: 'cannot delete detail sales order from closed or canceled sales order'
						})
			}

			await Promise.all([
				this.releaseQty([
					{
						location_id: dataDetailSalesOrder.dataValues.sod_loc_id,
						product_id: dataDetailSalesOrder.dataValues.sod_pt_id,
						inventory_oid: dataDetailSalesOrder.dataValues.sod_invc_oid,
						quantity: dataDetailSalesOrder.dataValues.sod_qty
					}
				]),
				SalesOrderService.deleteDetailSalesOrder( req.params.detail_sales_order_oid, transaction )
			])

			await transaction.commit();

			await this.updateTotalPrice( dataDetailSalesOrder.dataValues.sod_so_oid );
			
			res.status(200)
				.json({
					status: 'success',
					message: 'detail sales order has been deleted',
					data: true,
					error: null
				})
		} catch (error) {
			await transaction.rollback();
			await errorLog('DELETE DETAIL SALES ORDER', error.message);

			res.status(500)
				.json({
					status: 'failed',
					message: 'error',
					data: null,
					error: 'Internal Server Error!'
				});
		}
	}

	returnResponse = (code, status, message, data) => {
		return {code, json: {status, message, data, error: null}}
	}

	generateDetailSalesOrder = async ( dataDetail, dataHeader, dataUser, transaction ) => {
		let result = [];
		let sequence = 0;

		for (const singularDataDetail of dataDetail) {
			if (dataHeader.is_consigment == 'Y') {
				await Promise.all([
					bookSerials(singularDataDetail.location_id, singularDataDetail.product_id, singularDataDetail.qty, transaction),
					bookInventory(singularDataDetail.inventory_oid, singularDataDetail.qty, transaction)
				])
			}

			result.push({
				sod_oid: uuidv4(),
				sod_dom_id: 1,
				sod_en_id: singularDataDetail.entity_id,
				sod_add_by: dataUser.usernama,
				sod_add_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				sod_so_oid: dataHeader.sales_order_oid,
				sod_seq: sequence,
				sod_is_additional_charge: singularDataDetail.additional_charge,
				sod_si_id: 992,
				sod_pt_id: singularDataDetail.product_id,
				sod_rmks: singularDataDetail.remarks,
				sod_qty: singularDataDetail.qty,
				sod_qty_alocated: 0,
				sod_um: 9964,
				sod_cost: singularDataDetail.cost,
				sod_price: singularDataDetail.price,
				sod_disc: singularDataDetail.discount,
				sod_sales_ac_id: dataHeader.account_id,
				sod_sales_sb_id: dataHeader.subaccount_id,
				sod_sales_cc_id: dataHeader.cost_center_id,
				sod_um_conv: singularDataDetail.um_conversion,
				sod_qty_real: singularDataDetail.qty,
				sod_taxable: 'N',
				sod_tax_inc: 'N',
				sod_tax_class: 9949,
				sod_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
				sod_payment: singularDataDetail.payment,
				sod_dp: singularDataDetail.prepayment,
				sod_sales_unit: singularDataDetail.sales_unit,
				sod_loc_id: singularDataDetail.location_id,
				sod_ppn_type: 'E',
				sod_invc_oid: singularDataDetail.inventory_oid,
				sod_ppn: 0,
				sod_pph: 0,
				sod_sales_unit_total: 0,
				sod_sqd_oid: (dataHeader.is_consigment == 'Y') ? null : singularDataDetail.detail_sales_quotation_oid,
				sod_so_sq_ref_oid: dataHeader.reference_sq_oid,
			});

			sequence += 1;
		}

		return result;
	}

	sumTotalPrice = ( dataDetail ) => {
		let total = 0;

		for (const singularDataDetail of dataDetail) {
			let qty = parseInt(singularDataDetail.qty);
			let price = parseInt(singularDataDetail.price);
			let discount = parseFloat(singularDataDetail.discount);

			total += (price * qty) - (price * qty * discount);
		};

		return total;
	}

	releaseQty = async ( dataDetail, transaction ) => {
		for (const {dataValues: singularDataDetail} of dataDetail) {
			await Promise.all([
				releaseSerials(singularDataDetail.location_id, singularDataDetail.product_id, singularDataDetail.quantity, transaction),
				releaseInventory(singularDataDetail.inventory_oid, singularDataDetail.quantity, transaction)
			])
		}
	}

	updateTotalPrice = async ( headerSalesOrderOid ) => {
		let totalPrice = await SalesOrderService.retrieveTotalPrice( headerSalesOrderOid );

		let dataUpdate = {
			total: totalPrice[0]['dataValues']['total_price'],
			terbilang: Bilangan.parse(totalPrice[0]['dataValues']['total_price'])
		};

		await SalesOrderService.updateHeaderSalesOrder( dataUpdate, headerSalesOrderOid );
	}
}

module.exports = new SalesOrderController()
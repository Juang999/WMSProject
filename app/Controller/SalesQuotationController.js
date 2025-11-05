const moment = require('moment');
const { info, error: errorLog } = require('../../helper/Logging');
const { SalesQuotationService } = require('../Services/ServiceContainer');

class SalesQuotationController {
    getHeaderSalesQuotationByDate = async ( req, res ) => {
        try {
            let params = {
                conditions: {
                    start_date: req.query.start_date || moment().startOf('months').format('YYYY-MM-DD'),
                    end_date: req.query.end_date || moment().endOf('months').format('YYYY-MM-DD'),
                    sales_quotation_code: req.query.sq_code || ''
                },
                sort: {
                    date: req.query.date_sort || 'DESC'
                }
            }

            let result = await SalesQuotationService.retrieveSalesQuotation( params );

            res.status(200)
                .json({
                    statu: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET HEADER SALES QUOTATION BY DATE', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    getDetailSalesQuotation = async ( req, res ) => {
        try {
            let headerSalesQuotationOid = req.params.header_sales_quotation_oid;

            let result = await SalesQuotationService.retrieveDetailSalesQuotation( headerSalesQuotationOid );

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: result,
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SALES QUOTATION', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }
}

module.exports = new SalesQuotationController();
const joi = require('joi');

let validation = joi.object({
    header_sales_quotation_oid: joi.string().required(),
    groceries: joi.string().required()
});

let createDetailSalesQuotationRequest = (req, res, next) => {
    let createDetailSalesQuotationValidation = validation.validate(req.body, {
        abortEarly: false
    });

    if (createDetailSalesQuotationValidation.error) {
        let error = createDetailSalesQuotationValidation.error.details.map(element => {
            return element.message
        })

        res.status(300)
            .json({
                status: 'failed',
                message: 'field required',
                data: null,
                error: error
            })

        return;
    }

    next();
}

module.exports = createDetailSalesQuotationRequest;
const joi = require('joi');

let validation = joi.object({
    product_id: joi.number().required(),
    location_id: joi.number().required(),
    qty: joi.number().required(),
    price: joi.number().required(),
    discount: joi.string().required(),
    ppn_type: joi.string().required(),
    prepayment: joi.string().required(),
    payment: joi.string().required(),
    sales_unit: joi.string().required()
});

let updateDetailSalesQuotationRequest = (req, res, next) => {
    let updateDetailSalesQuotationValidation = validation.validate(req.body, {
        abortEarly: false
    });

    if (updateDetailSalesQuotationValidation.error) {
        let error = updateDetailSalesQuotationValidation.error.details.map(element => {
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

module.exports = updateDetailSalesQuotationRequest;
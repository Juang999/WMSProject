const joi = require('joi');

let validation = joi.object({
    date: joi.date().required(),
    sales_person_id: joi.number().required(),
    account_id: joi.number().required(),
    po_customer_reff: joi.string().allow(null, '', '-'),
    approval_id: joi.number().required(),
    subaccount_id: joi.number().required(),
    cost_center_id: joi.number().required(),
    git_location_id: joi.number().required(),
    destination_location_id: joi.number().required(),
    pricelist_area_id: joi.number().required(),
    credit_terms_id: joi.number().required(),
    payment_method_id: joi.number().required(),
    need_date: joi.string().required(),
    remarks: joi.string().allow(null, '-', ''),
    is_consigment: joi.string().min(1).required()
});

let CreateSalesQuotationRequest = (req, res, next) => {
    let createSalesQuotationValidation = validation.validate(req.body, {
        abortEarly: false
    });

    if (createSalesQuotationValidation.error) {
        let error = createSalesQuotationValidation.error.details.map(element => {
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

module.exports = CreateSalesQuotationRequest;
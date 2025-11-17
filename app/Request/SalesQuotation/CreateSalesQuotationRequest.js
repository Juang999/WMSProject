const joi = require('joi');

let validation = joi.object({
    entity_id: joi.number().required(),
    site_id: joi.number().required(),
    date: joi.date().required(),
    sales_person_id: joi.number().required(),
    customer_id: joi.number().required(),
    po_customer_reff: joi.number().allow(null, '', '-'),
    sq_type: joi.string().required(),
    account_id: joi.number().required(),
    subaccount_id: joi.number().required(),
    cost_center_id: joi.number().required(),
    exchange_rate: joi.number().default(1),
    is_booking: joi.string().min(1).required(),
    currency_id: joi.number().required(),
    deposit: joi.number().default(0).allow(null, '-', ''),
    start_date_booking: joi.date().allow(null, '', '-'),
    end_date_booking: joi.date().allow(null, '', '-'),
    origin_location_id: joi.number().required(),
    git_location_id: joi.number().required(),
    destination_location_id: joi.number().required(),
    pricelist_area_id: joi.number().required(),
    pricelist_id: joi.number().required(),
    credit_terms_id: joi.number().required(),
    need_date: joi.string().required(),
    payment_method_id: joi.number().required(),
    payment_type_id: joi.number().required(),
    remarks: joi.string().allow(null, '-', ''),
    is_package: joi.string().default('N').allow(null, '', '-'),
    sales_program: joi.string().allow(null, '', '-'),
    is_dropship: joi.string().default('N').allow(null, '', '-'),
    dropshipper_id: joi.number().allow(null, '', '-'),
    is_consigment: joi.string().min(1).required(),
    is_rebooking: joi.string().min(1).required(),
    dropship_partner_id: joi.number().allow(null, '', '-'),
    groceries: joi.string().required(),
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
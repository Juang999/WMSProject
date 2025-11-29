const Joi = require('joi');

const validation = Joi.object({
    entity_id: Joi.number().required(),
    site_id: Joi.number().required(),
    sales_quotation_code: Joi.string().allow(null, '', '-'),
    sales_quotation_oid: Joi.string().allow(null, '', '-'),
    purchase_order_code: Joi.string().allow(null, '', '-'),
    purchase_order_oid: Joi.string().allow(null, '', '-'),
    date: Joi.string().required(),
    customer_id: Joi.number().required(),
    sales_person_id: Joi.number().required(),
    partner_group_customer_id: Joi.number().required(),
    account_id: Joi.number().required(),
    subaccount_id: Joi.number().required(),
    cost_center_id: Joi.number().required(),
    currency_id: Joi.number().required(),
    total_ppn: Joi.number().required(),
    total_pph: Joi.number().required(),
    payment: Joi.number().required(),
    exchange_rate: Joi.number().default(1),
    is_consigment: Joi.string().required(),
    type: Joi.string().required(),
    payment_type: Joi.number().required(),
    credit_term_id: Joi.number().required(),
    payment_date: Joi.string().required(),
    remarks: Joi.string().allow(null, '', '-'),
    pricelist_area_id: Joi.number().required(),
    pricelist_id: Joi.number().required(),
    sales_program_id: Joi.number().allow(null, '', '-'),
    payment_method: Joi.number().required(),
    approval_type_id: Joi.number().default(19),
    bank_id: Joi.number().required(),
    is_package: Joi.string().allow(null, '', '-'),
    shipping_charges: Joi.number().allow(null, '', '-'),
    is_booking: Joi.string().required(),
    origin_location_id: Joi.number().allow(null, '', '-'),
    destination_location_id: Joi.number().allow(null, '', '-'),
    git_location_id: Joi.number().allow(null, '', '-'),
    book_start_date: Joi.string().required(),
    book_end_date: Joi.string().required(),
    invoice_number: Joi.string().allow(null, '', '-'),
    detail_sales_order: Joi.string().required()
});

const CreateSalesOrderRequest = ( req, res, next ) => {
    const CreateSalesOrderValidation = validation.validate(req.body, {
        abortEarly: false
    });

    if (CreateSalesOrderValidation.error) {
        let errors = CreateSalesOrderValidation.error.details.map(item => item.message);
        
        return res.status(400)
            .json({
                status: 'required',
                message: 'fields required',
                data: null,
                error: errors
            })
    }

    next();
}

module.exports = CreateSalesOrderRequest;
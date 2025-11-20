const Joi = require('joi');

const validation = Joi.object({
    entity_id: Joi.number().required(),
    effective_date: Joi.date().required(),
    header_sales_order_oid: Joi.string().required(),
    currency_id: Joi.number().required(),
    remarks: Joi.string().allow(null, '', '-'),
    detail_shipment: Joi.string().required()
});

const CreateSalesOrderShipmentRequest = (req, res, next) => {
    const CreateSalesOrderShipmentValidation = validation.validate(req.body, {
        abortEarly: false
    });

    if (CreateSalesOrderShipmentValidation.error) {
        let error = CreateSalesOrderShipmentValidation.error.details.map(item => item.message);

        res.status(400)
            .json({
                status: 'failed',
                message: 'field required',
                data: null,
                error: error
            });

        return;
    }

    next();
}

module.exports = CreateSalesOrderShipmentRequest;
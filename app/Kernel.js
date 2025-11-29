module.exports = {
    Requests: {
        SalesQuotation: {
            // header request
            CreateSalesQuotationRequest: require('./Request/SalesQuotation/CreateSalesQuotationRequest'),
            UpdateSalesQuotationRequest: require('./Request/SalesQuotation/UpdateSalesQuotationRequest'),
            // detail Request
            CreateDetailSalesQuotationRequest: require('./Request/SalesQuotation/CreateDetailSalesQuotationRequest'),
            UpdateDetailSalesQuotationRequest: require('./Request/SalesQuotation/UpdateDetailSalesQuotationRequest'),
        },
        SalesOrderShipment: {
            CreateSalesOrderShipmentRequest: require('./Request/SalesOrderShipment/CreateSalesOrderShipmentRequest')
        },
        SalesOrder: {
            CreateSalesOrderRequest: require('./Request/SalesOrder/CreateSalesOrderRequest')
        }
    }
}
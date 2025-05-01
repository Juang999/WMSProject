const {ShipmentService, SalesOrderService, OpnameService, LocationService, InventoryService} = require('../Services/ServiceContainer');
const {info, error: errorLog} = require('../../helper/Logging');
const { sequelize } = require('../../models');

class SoShipmentController {
    detail = async (req, res) => {
        try {
            let dataShipment = await ShipmentService.getDetailShipment(req.params.shipment_code);

            if (dataShipment == undefined) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'not found',
                        data: null,
                        error: null
                    })

                return;
            }

            let idLocation = dataShipment.dataValues.detail_soship.map(({dataValues: detailShipment}) => detailShipment.location_id);
            dataShipment.dataValues.locations = await LocationService.findLocations(idLocation);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: dataShipment,
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SHIPMENT', error.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    detailSalesOrder = async (req, res) => {
        try {
            let dataSalesOrder = await SalesOrderService.getDetailSalesOrder(req.params.sales_order_code);

            if (dataSalesOrder == undefined) {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'not found',
                        data: null,
                        error: null
                    })

                return 
            }

            let idsLocation = [...new Set(dataSalesOrder.dataValues.detail_sales_order.map(({dataValues: dataDetail}) => dataDetail.location_id))];
            dataSalesOrder.dataValues.locations = await LocationService.findLocations(idsLocation);

            res.status(200)
                .json({
                    status: 'success',
                    message: 'ok',
                    data: dataSalesOrder,
                    error: null
                })
        } catch (error) {
            await errorLog('GET DETAIL SALES ORDER', error.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: error.message
                })
        }
    }

    shipSerial = (req, res) => {
        let {serial, product_code, sod_oid, so_oid, location_id} = req.body;

        sequelize.transaction(async t => {
            let [
                DATA_SERIAL_NUMBER,
                DATA_SERIAL_IN_SALES_ORDER,
                TOTAL_SERIAL_SALES_ORDER,
                QTY_NEEDED
            ] = await Promise.all([
                OpnameService.findSerialNumber(serial, product_code, t),
                SalesOrderService.checkSerialSalesOrder(sod_oid, serial),
                SalesOrderService.countSerialSalesOrder(sod_oid),
                SalesOrderService.findDetailSalesOrder(sod_oid)
            ])

            if (TOTAL_SERIAL_SALES_ORDER >= parseInt(QTY_NEEDED.sod_qty)) {
                return this.returnResponse(300, 'exceed', 'The series you scanned exceeded the limit', null);
            }

            if (DATA_SERIAL_NUMBER == null) {
                return this.returnResponse(404, 'not found', 'serial not found', null);
            }

            if (DATA_SERIAL_NUMBER.dataValues.invcd_locs_id == null) {
                return this.returnResponse(300, 'unregistered', 'serial not registered', null);
            }

            if (DATA_SERIAL_NUMBER.dataValues.invcd_is_booked == 1) {
                return this.returnResponse(300, 'booked', 'serial already booked', null);
            }

            if (parseInt(DATA_SERIAL_NUMBER.dataValues.qty) == 0) {
                return this.returnResponse(405, 'not found', 'serial has been shipped', null)
            }

            if (DATA_SERIAL_IN_SALES_ORDER != null) {
                return this.returnResponse(300, 'data already exist', 'series already included in the list', {serial});
            }

            let [result] = await Promise.all([
                SalesOrderService.insertSerialSalesOrder(req.body, DATA_SERIAL_NUMBER.dataValues, t),
                InventoryService.bookSerial(DATA_SERIAL_NUMBER.dataValues.invcd_oid, so_oid)
            ])

            return this.returnResponse(200, 'success', 'Data is included in the list', result);
        })
        .then(result => {
            res.status(result.responseCode)
                .json(result.json)
        })
        .catch(err => {
            errorLog('INPUT SERIAL', err.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    findProductBySerial = (req, res) => {
        let {serial} = req.params;

        OpnameService.newFindSerialNumber(serial, null)
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
            errorLog('FIND PRODUCT BY SERIAL', err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    detailSerial = async (req, res) => {
        ShipmentService.getDetailSerial(req.params.detail_shipment_oid)
        .then(result => {
            let code = (result != undefined) ? 200 : 404;
            let status = (result != undefined) ? 'succes' : 'not found';
            let message = (result != undefined) ? 'ok' : 'not found';
            let data = (result != undefined) ? result : null;

            res.status(code).json({status, message, data, error: null})
        })
        .catch(err => {
            errorLog('SHIPMENT DETAIL SERIAL', err.message)

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    detailSerialSalesOrder = async (req, res) => {
        SalesOrderService.getSerialProductSalesOrder(req.params.sod_oid)
        .then(result => {
            let code = (result == null) ? 404 : 200;
            let status = (result == null) ? 'not found' : 'success';
            let message = (result == null) ? 'not found' : 'ok';
            let data = (result == null) ? null : result;

            res.status(code).json({status, message, data, error: null})
        })
        .catch(err => {
            errorLog(`GET DETAIL SERIAL PRODUCT`, err.message);

            res.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                });
        })
    }

    deleteSerialSalesOrder = async (req, res) => {
        let sods_oid = req.params.serial_oid;

        SalesOrderService.deleteSerialShipment(sods_oid)
        .then(result => {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'deleted',
                    data: 1,
                    error: null
                })
        })
        .catch(err => {
            req.status(400)
                .json({
                    status: 'failed',
                    message: 'error',
                    data: null,
                    error: err.message
                })
        })
    }

    returnResponse = (code, status, message, data) => {
        return {
            responseCode: code,
            json: {
                status: status,
                message: message,
                data: data,
                error: null
            }
        }
    }
}

module.exports = new SoShipmentController();
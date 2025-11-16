const { PoMstr, PodDet } = require('../../models');

class PurchaseOrderService {
    findPurchaseOrderByOid = async ( purchaseOrderCode ) => {
        let result = await PoMstr.findOne({
            attributes: ['po_oid', 'po_code'],
            where: {
                po_code: purchaseOrderCode
            }
        });

        return result;
    }

    findHeaderPurchaseOrderByCode = async ( poCode ) => {
        let result = await PoMstr.findOne({
            attributes: ['po_oid', 'po_code'],
            where: {
                po_code: poCode
            }
        });

        return result;
    }
}

module.exports = new PurchaseOrderService();
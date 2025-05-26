const { DbBarangSn } = require('../../modules/GetDesc/models');

class GetDescService {
    findOldProductBySerialNumber = async (serialNumber) => {
        let result = await DbBarangSn.findOne({
            attributes: ['pn'],
            where: {
                sn: serialNumber
            }
        })

        return result;
    }

    findAllOldProductBySerialNumber = async (serialNumber) => {
        let result = await DbBarangSn.findAll({
            attributes: ['pn'],
            where: {
                sn: serialNumber
            }
        })

        return result;
    }
}

module.exports = new GetDescService();
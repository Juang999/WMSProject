const { DbBarangSn } = require('../../modules/GetDesc/models');

class GetDescService {
    findOldProductBySerialNumber = async (serialNumber) => {
        let result = await DbBarangSn.findOne({
            attributes: ['pn', 'sn', 'nama_barang'],
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

    findOldProductBySerialNumberAndPartnumber = async (serialNumber, partNumber) => {
        let result = await DbBarangSn.findOne({
            attributes: ['pn', 'sn', 'nama_barang'],
            where: {
                sn: serialNumber,
                pn: partNumber
            }
        })

        return result;
    }

    deleteSn = async (partNumber, serialNumber, productName) => {
        let result = await DbBarangSn.destroy({
            where: {
                pn: partNumber,
                sn: serialNumber,
                nama_barang: productName
            }
        });

        return result;
    }
}

module.exports = new GetDescService();
const { PsMstr, PsdDet } = require('../../models');

class PackageService {
    retrieveHeaderPackage = async ( entityId ) => {
        let result = await PsMstr.findAll({
            attributes: [
                ['ps_oid', 'package_oid'],
                ['ps_id', 'package_id'],
                ['ps_desc', 'package_description']
            ],
            where: {
                ps_en_id: entityId
            }
        });

        return result;
    }
}

module.exports = new PackageService();
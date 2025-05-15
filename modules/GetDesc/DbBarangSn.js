const { sequelize, DataTypes } = require('./Connection');

const DbBarangSn = sequelize.define('DbBarangSn', {
    pn: {
        type: DataTypes.STRING,
    },
    sn: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nama_barang: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'db_barang_sn',
    timestamps: false
})

module.exports = DbBarangSn;
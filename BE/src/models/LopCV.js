const mongoose = require('mongoose');

const _LopCoVan = new mongoose.Schema({
    Ten: String,
    Khoa: Number,
    SinhVien: Array,
    MaLopCoVan: String,
});

const LopCoVan = mongoose.model('LopCoVan', _LopCoVan);

module.exports = LopCoVan;

const mongoose = require('mongoose');

const _HocPhan = new mongoose.Schema({
    Ten: String,
    MaHocPhan: String,
    SinhVien: [
        {
            Ten: String,
            LopCoVan: String,
            MaSinhVien: String,
            MaRFID: String,
        }
    ],
    LichHoc: [
        {
            Thu: Number,
            Ngay: String,
            BatDau: String,
            KetThuc: String,
            DiemDanh: [
                {
                    Ten: String,
                    MaSinhVien: String,
                    MaRFID: String,
                    LopCoVan: String,
                    Gio: String,
                    Ngay: String,
                    TrangThai: Boolean,
                }
            ]
        }
    ],
    NgayNghi: Array,
    BatDau: String,
    KetThuc: String,
    // DiemDanh: [
    //     {
    //         Ten: String,
    //         MaSinhVien: String,
    //         LopCV: String,
    //         Gio: String,
    //         Ngay: String,
    //         TrangThai: Boolean,
    //     }
    // ]
});

const HocPhan = mongoose.model('HocPhan', _HocPhan);

module.exports = HocPhan;

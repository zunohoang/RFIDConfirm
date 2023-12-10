const mongoose = require('mongoose');

const _SinhVien = new mongoose.Schema({
    Ten: String,
    MaSinhVien: String,
    MaRFID: String,
    MaLopCovan: String,
    HocPhan: [
        {
            Ten: String,
            MaHocPhan: String,
            LichHoc: [
                {
                    Thu: Number,
                    BatDau: String,
                    KetThuc: String
                }
            ]
        }
    ],
    ThongTin: {
        TaiKhoan: String,
        MatKhau: String,
    }
});

const SinhVien = mongoose.model('SinhVien', _SinhVien);

module.exports = SinhVien;

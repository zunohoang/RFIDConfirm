const SinhVien = require('../models/SinhVien');
const moment = require('moment');


class sinhvienController {
    async addSinhVien(req, res, next) {
        var newSV = new SinhVien({
            Ten: req.body.Ten,
            MaLopCovan: req.body.LopCoVan,
            MaSinhVien: req.body.MaSinhVien,
            MaRFID: req.body.MaRFID,
            HocPhan: [],
            ThongTin: {}
        })
        newSV.save()
            .then(() => {
                return res.status(200).json({
                    code: true,
                    message: 'Add SinhVien success',
                })
            })
            .catch((err) => {
                return res.status(401).json({
                    code: false,
                    error: 'Unauthorized'
                })
            })
    }
    getAllSinhVien(req, res, next) {
        SinhVien.find({})
            .then((sinhvien) => {
                return res.status(200).json({
                    code: true,
                    sinhvien: sinhvien
                })
            })
            .catch((err) => {
                return res.status(401).json({
                    code: false,
                    error: 'Unauthorized'
                })
            })
    }
}

module.exports = new sinhvienController();
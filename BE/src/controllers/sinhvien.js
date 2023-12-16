const SinhVien = require('../models/SinhVien');
const moment = require('moment');


class sinhvienController {
    addSinhViens(req, res, next) {
        var sheet = req.body.sheet;
        console.log(sheet)
        SinhVien.insertMany(sheet)
            .then(() => {
                return res.status(200).json({
                    code: true,
                    message: 'Thêm thành công ALL sinh viên'
                }

                )
            })
            .catch((err) => {
                return res.status(401).json({
                    code: false,
                    error: 'Thất bại'
                })
            })
    }
    deleteSinhVien(req, res, next) {
        SinhVien.findOneAndDelete({
            "MaSinhVien": req.params.MaSinhVien,
        })
            .then(() => {
                return res.status(200).json({
                    code: true,
                    message: 'Delete success',
                })
            })
            .catch(err => {
                return res.status(500).json({
                    code: false,
                    error: err,
                })
            })
    }
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
                    message: 'Thêm thành công sinh viên ' + req.body.Ten
                }

                )
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
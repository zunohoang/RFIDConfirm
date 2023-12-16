const HocPhan = require('../models/HocPhan');
const SinhVien = require('../models/SinhVien');
const moment = require('moment');
const jwt = require('jsonwebtoken');
async function dataSinhVien(maSinhVien) {
    try {
        const data = await SinhVien.findOne({ MaSinhVien: maSinhVien }, "Ten MaSinhVien MaLopCovan MaRFID");

        if (data) {
            return {
                Ten: data.Ten,
                MaSinhVien: data.MaSinhVien,
                LopCoVan: data.MaLopCovan,
                MaRFID: data.MaRFID,
            };
        } else {
            return null; // hoặc giá trị mặc định tùy thuộc vào logic của bạn
        }
    } catch (error) {
        console.error(error);
        return -1; // hoặc giá trị mặc định tùy thuộc vào logic của bạn
    }
}

class hocphanController {

    addHocPhans(req, res, next) {
        var sheet = req.body.sheet;
        console.log(sheet)
        HocPhan.insertMany(sheet)
            .then(() => {
                res.json(
                    {
                        code: true,
                        message: 'Thêm thành công ALL hoc phan'
                    }
                )
            })
            .catch((err) => {
                res.status(500).json({
                    code: false,
                    error: err
                })
            })
    }

    addSinhViens(req, res, next) {
        var sheet = req.body.sheet;
        console.log(sheet)
        HocPhan.findOneAndUpdate({
            MaHocPhan: req.params.MaHocPhan
        }, {
            $push: {
                SinhVien: {
                    $each: sheet
                }
            }
        })
            .then(() => {
                res.json(
                    {
                        code: true,
                        message: 'Thêm thành công ALL sinh viên'
                    }
                )
            })
            .catch((err) => {
                res.status(401).json({
                    code: false,
                    error: 'That bai'
                })
            })
    }

    addSinhVien(req, res, next) {
        console.log(req.body)
        HocPhan.findOne({ MaHocPhan: req.params.MaHocPhan })
            .then((hocphan) => {
                if (hocphan) {
                    hocphan.SinhVien.push({
                        Ten: req.body.Ten,
                        MaSinhVien: req.body.MaSinhVien,
                        MaRFID: req.body.MaRFID,
                        LopCoVan: req.body.LopCoVan,
                    });
                    hocphan.save()
                        .then(() => {
                            return res.status(200).json({
                                code: true,
                                message: 'Add hocphan success',
                            })
                        })
                        .catch((err) => {
                            return res.status(401).json({
                                code: false,
                                error: 'Unauthorized'
                            })
                        })
                }
                else {
                    console.log(2)
                    return res.status(401).json({
                        code: false,
                        error: 'Unauthorized'
                    })
                }
            })
            .catch((err) => {
                return res.status(401).json({
                    code: false,
                    error: 'Unauthorized'
                })
            })
    }
    // DELETE api/deleteHocPhan/:MaHocPhan
    deleteHocPhan(req, res, next) {
        HocPhan.findOneAndDelete({
            "MaHocPhan": req.params.MaHocPhan,
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
    // GET api/getHocPhan
    getHocPhan(req, res, next) {
        if (req.query.MaHocPhan != null) {
            HocPhan.findOne({ MaHocPhan: req.query.MaHocPhan })
                .then((hocphan) => {
                    console.log(hocphan)
                    return res.status(200).json({
                        code: true,
                        hocphan: hocphan
                    })
                })
                .catch((err) => {
                    return res.status(401).json({
                        code: false,
                        error: 'Unauthorized'
                    })
                })
        } else
            HocPhan.find({})
                .then((hocphan) => {
                    console.log(hocphan)
                    return res.status(200).json({
                        code: true,
                        hocphan: hocphan
                    })
                })
                .catch((err) => {
                    return res.status(401).json({
                        code: false,
                        error: 'Unauthorized'
                    })
                })
    }
    // POST /addHocPhan
    async addHocPhan(req, res, next) {
        var sinhviens = [];
        for (var i = 0; i < req.body.SinhVien.length; i++) {
            const result = await dataSinhVien(req.body.SinhVien[i]);
            sinhviens.push(result);
        }
        var hocphan = new HocPhan({
            Ten: req.body.Ten,
            MaHocPhan: req.body.MaHocPhan,
            LichHoc: req.body.LichHoc,
            SinhVien: sinhviens,
        })
        hocphan.save()
            .then(() => {
                return res.status(200).json({
                    code: true,
                    message: 'Add hocphan success',
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

module.exports = new hocphanController();
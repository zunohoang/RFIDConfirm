const HocPhan = require('../models/HocPhan');
const SinhVien = require('../models/SinhVien');
const moment = require('moment');


const KiemTraChenhLech = (MocThoiGian) => {
    const ThoiGianHienTai = moment();
    const ThoiGianMoc = moment(MocThoiGian, "HH:mm");
    const MocTheoPhut = ThoiGianMoc.diff(ThoiGianHienTai, 'minutes');
    return Math.abs(MocTheoPhut) <= 30;
};

class confirmController {

    // POST /confirm/:MaSinhVien 
    // body: {UIDrfid, TOKEN} ;
    async insert(req, res, next) {
        var x = moment().format('DD/MM/YYYY');
        console.log(x);
        HocPhan.find({
            "SinhVien.MaRFID": req.body.MaRFID,
            "LichHoc.Ngay": x
        })
            .then(hocPhans => {
                var check = false;
                for (let temp in hocPhans) {
                    var hocPhan = hocPhans[temp];
                    if (!hocPhan) {
                        continue;
                        return res.json({
                            code: false,
                            error: "Không tìm thấy lich hoc 1"
                        })
                    }

                    // Tìm index của lịch học hôm nay
                    const index = hocPhan.LichHoc.findIndex(lichHoc => (lichHoc.Ngay === moment().format('DD/MM/YYYY') && KiemTraChenhLech(lichHoc.BatDau)));

                    // Kiểm tra lịch học có hôm nay không
                    if (index === -1) {
                        continue;
                        return res.json({
                            code: false,
                            error: "Khong tim thay lich hoc khong dung gio",
                            HocPhan: hocPhan,
                        })
                    }

                    // Kiểm tra sinh viên đã điểm danh chưa
                    if (hocPhan.LichHoc[index].DiemDanh.findIndex(sinhVien => sinhVien.MaRFID == req.body.MaRFID) != -1) {
                        return res.json({
                            code: true,
                            message: "Sinh vien da diem danh o"
                        })
                    }

                    // Tìm index của sinh viên trong mảng SinhVien
                    const indexSinhVien = hocPhan.SinhVien.findIndex(sinhVien => sinhVien.MaRFID === req.body.MaRFID);
                    req.user = hocPhan.SinhVien[indexSinhVien];

                    // Chèn thông tin vào LichHoc.i.DiemDanh
                    hocPhan.LichHoc[index].DiemDanh.push({
                        Ten: req.user.Ten,
                        MaSinhVien: req.user.MaSinhVien,
                        MaRFID: req.user.MaRFID,
                        LopCoVan: req.user.LopCoVan,
                        Gio: moment().format('HH:mm:ss'),
                        Ngay: moment().format('DD/MM/YYYY'),
                        TrangThai: true,
                    });
                    hocPhans[temp] = hocPhan;
                    // Lưu hp vào cơ sở dữ liệu
                    check = true;
                    hocPhan.save()
                        .then(data => {
                            return res.json({
                                code: true,
                                message: 'Confirm success',
                            })
                        })
                        .catch(err => {
                            return res.json({
                                code: false,
                                error: err,
                            })
                        })
                }
                if (check == false) {
                    return res.json({
                        code: false,
                        error: "Khong tim thay lich hoc"
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    code: false,
                    error: err,
                })
            })
    }


    // // POST /confirm/:MaSinhVien
    // insert(req, res) {
    //     SinhVien.findOneAndUpdate({
    //         "MaSinhVien": req.params.MaSinhVien,
    //         "HocPhan.MaHocPhan": req.user.MaHocPhan,
    //     }, {
    //         "$push": {
    //             "HocPhan.$.DiemDanh": req.user
    //         }
    //     })
    //         .then(() => {
    //             HocPhan.findOneAndUpdate({
    //                 "MaHocPhan": req.user.MaHocPhan,
    //             }, {
    //                 "$push": {
    //                     "DiemDanh": req.user
    //                 }
    //             })
    //                 .then(() => {
    //                     return res.status(200).json({
    //                         code: true,
    //                         message: 'Confirm success',
    //                     })
    //                 })
    //                 .catch(err => {
    //                     return res.status(500).json({
    //                         code: false,
    //                         error: 3,
    //                     })
    //                 })
    //         })
    //         .catch(err => {
    //             return res.status(500).json({
    //                 code: false,
    //                 error: 2,
    //             })
    //         })
    // }
}

module.exports = new confirmController();
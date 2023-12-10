const express = require('express');
const router = express.Router();
const confirmController = require('../controllers/confirm.js')
const auth = require('../middleware/auth.js')
const userController = require('../controllers/user.js')
const jwt = require('jsonwebtoken');
const sinhvienController = require('../controllers/sinhvien.js')
const hocphanController = require('../controllers/hocphan.js')
//const authConfirm = require('../middleware/authConfirm.js')
router.post('/login', userController.login)
router.post('/confirm/', auth, confirmController.insert)
router.get('/getHocPhan', userController.checkToken, hocphanController.getHocPhan)
router.post('/addHocPhan', userController.checkToken, hocphanController.addHocPhan)
router.post('/addSinhVien', userController.checkToken, sinhvienController.addSinhVien)
router.get('/getAllSinhVien', userController.checkToken, sinhvienController.getAllSinhVien)

module.exports = router;
const HocPhan = require('../models/HocPhan');
const SinhVien = require('../models/SinhVien');
const moment = require('moment');
const jwt = require('jsonwebtoken');
class userController {
    login(req, res, next) {
        if (req.body.username == 'admin' && req.body.password == '12345678') {
            var token = jwt.sign({
                username: req.body.username,
                password: req.body.password
            }, 'KEYDUNGDEMAHOA');
            res.status(200).json({
                code: true,
                token: token
            })
        } else {
            res.status(401).json({
                code: false,
                error: 'Unauthorized'
            })
        }
    }
    checkToken(req, res, next) {
        console.log(req.query.token)
        jwt.verify(req.query.token, 'KEYDUNGDEMAHOA', (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Unauthorized' })
            } else {
                next()
            }
        })
    }
}

module.exports = new userController();
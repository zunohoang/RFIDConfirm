const HocPhan = require('../models/HocPhan');
const SinhVien = require('../models/SinhVien');
const moment = require('moment');
const jwt = require('jsonwebtoken');
class userController {
    login(req, res, next) {
        console.log(req.body)
        if (req.body.username == 'admin' && req.body.password == '12345678') {
            var token = jwt.sign({
                username: req.body.username,
                password: req.body.password
            }, 'KEYDUNGDEMAHOA');
            console.log(token);
            res.status(200).json({
                code: true,
                token: token
            })
        } else {
            console.log(2);
            res.status(401).json({
                code: false,
                error: 'Unauthorized'
            })
        }
    }
    checkToken(req, res, next) {
        var token = req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        jwt.verify(token, 'KEYDUNGDEMAHOA', (err, decoded) => {
            if (err) {
                res.status(401).json(
                    {
                        code: false,
                        error: 'Unauthorized'
                    })
            } else {
                next()
            }
        })
    }
}

module.exports = new userController();
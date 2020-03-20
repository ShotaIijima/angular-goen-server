const msgs = require('./msgs')
const jwt = require('jsonwebtoken');
const conf = require('../conf');
const User = require('../models/User');
const logger = require("../libs/log/logger").application;

module.exports = {
    login: function (req, res, next) {
        User.getByBasic(req.body.mail_address, req.body.password)
        .then((user) => {
            const token = jwt.sign({user}, conf['session']['key'], {expiresIn: conf['session']['expiresIn']});
            res.json({
                code: 200,
                res: {
                    token: token,
                    user: user
                }
            });
        })
        .catch((err) => {
            console.log(err)
            res.json({
                code: 403,
                err: err
            });
        })
    },
    signin: function (req, res, next) {
        User.makeNew(req.body.account, req.body.mail_address, req.body.password)
        .then((user) => {
            const token = jwt.sign({user}, conf['session']['key'], {expiresIn: conf['session']['expiresIn']});
            res.json({
                code: 200,
                res: {
                    token: token,
                    user: user
                }
            });
        }).catch((err) => {
            res.json({
                code: 403,
                err: err
            });
        })
    },
    fbAuthCallback: function (req, res) {
        User.makeNewFBUser(req.user)
        .then((user) => {
            const token = jwt.sign({user}, conf['session']['key'], {expiresIn: conf['session']['expiresIn']});
            req.session.token = token;
            res.redirect('http://localhost:4200/pages/index');
        }).catch((err) => {
            console.log(err);
            res.redirect('http://localhost:4200/login');
        })
    }
}

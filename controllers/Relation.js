const relation = require('../models/Relation')
const msgs = require('./msgs')

module.exports = {
    doGetAll: function (req, res, next) {
        if(req.account.user.auth_type < 3) {
            relation.getByWorkerId(req.account.user.id)
            .then((results) => {
                res.json({code: 200, res: results})
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    code: 403,
                    err: err
                });
            })
        } else {
            relation.getByMngId(req.account.user.id)
            .then((results) => {
                res.json({code: 200, res: results})
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    code: 403,
                    err: err
                });
            })
        }
    },
    update: function (req, res, next) {
        if(req.account.user.auth_type < 3) {
            relation.updateWorkerRelation(req.body, req.account.user.id)
            .then((results) => {
                res.json({code: 200, res: results})
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    code: 403,
                    err: err
                });
            })
        } else {
            relation.updateMngRelation(req.body, req.account.user.id)
            .then((results) => {
                res.json({code: 200, res: results})
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    code: 403,
                    err: err
                });
            })
        }
    }
}

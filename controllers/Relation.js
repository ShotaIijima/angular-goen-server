const relation = require('../models/Relation')
const msgs = require('./msgs')
const tduser = require('../models/TDUser')

module.exports = {
    doGetAll: function (req, res, next) {
        if(req.account.user.auth_type < 3) {
            relation.getByWorkerId(req.account.user.id)
            .then((results) => {
                console.log(results);
                for(var i=0; i<results.length; i++){
                    tduser.getByUser(results[i].id)
                        .then((tdusers) => {
                            results[i]["tdusers"] = tdusers.map(tdu => tdu.type_detail)
                        });
                }
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
                console.log(results.length);
                for(var i=0; i<results.length; i++){
                    console.log(i);
                    results[i]["tdusers"] = "stgss"
                    tduser.getByUser(results[i].id)
                        .then((tdusers) => {
                            if(tdusers.length !== 0)
                                results[i]["tdusers"] = tdusers.map(tdu => tdu.type_detail)
                        });
                }
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
        if(req.body.memo != null) {
            req.body.memo = `'${req.body.memo}'`
        }
        if(req.body.last_login != null) {
            req.body.last_login = `'${req.body.last_login}'`
        }
        if(req.body.com_url != null) {
            req.body.com_url = `'${req.body.com_url}'`
        }
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

const user = require('../models/User');

module.exports = {
    doGetOne: function (req, res, next) {
        user.getOne(req.params['id'])
        .then((result) => {
            res.json({
                message: "Hello,world"
            });
        })
        .catch((err) => {
            console.log(err);
        })
    },
    doUpdate: function (req, res, next) {
        if(req.account.user.id === req.body.id) {
            user.updateUser(req.body)
            .then((result) => {
                res.json({
                    code: 200
                });
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    code: 403,
                    err: err
                });
            })
        } else {
            res.json({
                code: 403,
                err: "not match user id"
            });
        }
    },
    savePhoto: function (req, res, next) {
        console.log(req.files);
        if(req.files.length !== 1 && req.files[0]["path"] == null) {
            res.json({
                code: 403,
                err: "not found file"
            });
        }
        user.updatePhotoPath(req.account.user.id, req.files[0]["path"])
        .then((result) => {
            res.json({
                code: 200,
                photo_path: req.files[0]["path"]
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                code: 403,
                err: "cant update photo path"
            });
        })
    }
}
const position = require('../models/Position')
const msgs = require('./msgs')

module.exports = {
    doGetOne: function (req, res, next) {
        position.getOne(req.params['id'])
        .then((result) => {
            res.json({code: 200, res: result})
        })
        .catch((err) => {
            console.log(err)
            res.json({code: 500, res: msgs.err.exception})
        })
    },
    doGetAll: function (req, res, next) {
        position.getAll()
        .then((result) => {
            res.json({code: 200, res: result})
        })
        .catch((err) => {
            console.log(err)
            res.json({code: 500, res: msgs.err.exception})
        })
    },
}
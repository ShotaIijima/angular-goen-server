const type = require('../models/TypeDetail')
const msgs = require('./msgs')

module.exports = {
    doGetByType: function (req, res, next) {
        type.getByType(req.body.type)
        .then((result) => {
            res.json({code: 200, res: result})
        })
        .catch((err) => {
            console.log(err)
            res.json({code: 500, res: msgs.err.exception})
        })
    }
}
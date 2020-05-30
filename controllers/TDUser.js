const type = require('../models/TDUser')
const msgs = require('./msgs')

module.exports = {
    doGetByUser: function (req, res, next) {
        type.getByUser(req.account.user.id)
        .then((result) => {
            res.json({code: 200, res: result})
        })
        .catch((err) => {
            console.log(err)
            res.json({code: 500, res: msgs.err.exception})
        })
    }
}
const position = require('../models/Position')
const area = require('../models/Area')
const reason = require('../models/Reason')
const type = require('../models/Type')

module.exports = {
    doGetAllMaster: function (req, res, next) {
        position.getAll()
        .then((positions) => {
            area.getAll()
            .then((areas) => {
                reason.getAll()
                .then((reasons) => {
                    type.getAll()
                    .then((types) => {
                        res.json({
                            code: 200,
                            res: {
                                positions: positions,
                                areas: areas,
                                reasons: reasons,
                                types: types
                            }
                        })
                    })
                })
            })
        })
        .catch((err) => {
            console.log(err)
            res.json({code: 500, res: msgs.err.exception})
        })
    },
}
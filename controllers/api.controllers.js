const { fetchingAllPathInfo } = require("../models/api.models")

exports.retrieveAllPathInfo = (req, res, next) => {
    fetchingAllPathInfo().then((endpointObject) => {
        res.status(200).send( { endpointObject } )
    })
    .catch((err) => {
        next(err)
    })
}
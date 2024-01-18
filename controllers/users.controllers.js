const { fetchAllUsers, fetchSpecificUser } = require("../models/users.models")

exports.retrieveUsers = (req, res, next) => {
    fetchAllUsers().then((users) => {
        res.status(200).send({ users })
    })
    .catch((err) => {
        next(err)
    })
}

exports.retrieveUserByUsername = (req, res, next) => {
    const { username } = req.params
    fetchSpecificUser(username).then((user) => {
        res.status(200).send({ user })
    })
    .catch((err) => {
        next(err)
    })
}
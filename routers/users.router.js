const userRouter = require("express").Router()

const { retrieveUsers } = require("../controllers/users.controllers")

userRouter.route("/")
    .get(retrieveUsers)

module.exports = userRouter;
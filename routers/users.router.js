const userRouter = require("express").Router()

const { retrieveUsers, retrieveUserByUsername } = require("../controllers/users.controllers")

userRouter.route("/")
    .get(retrieveUsers)

userRouter.route("/:username")
    .get(retrieveUserByUsername)

module.exports = userRouter;
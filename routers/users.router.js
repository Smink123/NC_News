const userRouter = require("express").Router()

const { retrieveUsers } = require("../controllers/users.controllers")

userRouter.get("/", retrieveUsers)

module.exports = userRouter;

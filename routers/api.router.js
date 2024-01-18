const apiRouter = require("express").Router()

const { retrieveAllPathInfo } = require("../controllers/api.controllers")

apiRouter.route("/")
    .get(retrieveAllPathInfo)

module.exports = apiRouter;
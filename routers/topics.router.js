const topicsRouter = require("express").Router()
const { retrieveTopics } = require("../controllers/topics.controllers")

topicsRouter.route("/")
    .get(retrieveTopics)

module.exports = topicsRouter;

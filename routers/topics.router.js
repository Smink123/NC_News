const topicsRouter = require("express").Router()
const { retrieveTopics, postNewTopic } = require("../controllers/topics.controllers")

topicsRouter.route("/")
    .get(retrieveTopics)
    .post(postNewTopic)

module.exports = topicsRouter;

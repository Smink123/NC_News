const topicsRouter = require("express").Router()
const { retrieveTopics } = require("../controllers/topics.controllers")

topicsRouter.get("/", retrieveTopics)

module.exports = topicsRouter;

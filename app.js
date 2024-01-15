const express = require("express");
const { retrieveTopics, incorrectPathNames } = require("./controllers/topics.controllers");
const { retrieveAllPathInfo } = require("./controllers/api.controllers")

const app = express();

app.use(express.json());

app.get("/api/topics", retrieveTopics);

app.get("/api", retrieveAllPathInfo)

app.all("*", incorrectPathNames);



module.exports = app;

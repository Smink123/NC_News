const express = require("express");
const {
  retrieveTopics,
  incorrectPathNames,
} = require("./controllers/topics.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", retrieveTopics);
app.all("*", incorrectPathNames);



module.exports = app;

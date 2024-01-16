const express = require("express");
const { retrieveTopics, incorrectPathNames } = require("./controllers/topics.controllers");
const { retrieveAllPathInfo } = require("./controllers/api.controllers")
const { retrieveArticleById, retrieveAllArticles, retrieveCommentsByArticleId } = require("./controllers/articles.controllers")

const app = express();

app.use(express.json());

app.get("/api/topics", retrieveTopics);

app.get("/api", retrieveAllPathInfo)

app.get("/api/articles/:article_id", retrieveArticleById)

app.get("/api/articles", retrieveAllArticles)

app.get("/api/articles/:article_id/comments", retrieveCommentsByArticleId)

app.all("*", incorrectPathNames);

app.use((err, req, res, next) => {
    if(err.status === 404){
        res.status(404).send(({msg: err.msg}))
    } else {
        next (err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send(({msg: "Bad request"}))
    }
})




module.exports = app;

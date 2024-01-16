const express = require("express");
const { retrieveTopics, incorrectPathNames } = require("./controllers/topics.controllers");
const { retrieveAllPathInfo } = require("./controllers/api.controllers")
const { retrieveArticleById, retrieveAllArticles, retrieveCommentsByArticleId, postNewComment } = require("./controllers/articles.controllers")

const app = express();

app.use(express.json());

app.get("/api/topics", retrieveTopics);

app.get("/api", retrieveAllPathInfo)

app.get("/api/articles/:article_id", retrieveArticleById)

app.get("/api/articles", retrieveAllArticles)

app.get("/api/articles/:article_id/comments", retrieveCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postNewComment)

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
    } else {
        next (err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === '23503'){
        res.status(404).send(({msg: "ID not found"}))
    } else {
        next (err)
    }
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send(({msg: "Internal error"}))
})

23503





module.exports = app;

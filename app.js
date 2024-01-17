const express = require("express");
const { retrieveTopics, incorrectPathNames } = require("./controllers/topics.controllers");
const { retrieveAllPathInfo } = require("./controllers/api.controllers")
const { retrieveArticleById, retrieveAllArticles, retrieveCommentsByArticleId, postNewComment, patchArticleById } = require("./controllers/articles.controllers")
const { deleteCommentById } = require("./controllers/comments.controllers")
const { retrieveUsers } = require("./controllers/users.controllers")

const app = express();

app.use(express.json());

app.get("/api/topics", retrieveTopics);

app.get("/api", retrieveAllPathInfo)

app.get("/api/articles/:article_id", retrieveArticleById)

app.get("/api/articles", retrieveAllArticles)

app.get("/api/articles/:article_id/comments", retrieveCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postNewComment)

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", retrieveUsers);


app.all("*", incorrectPathNames);

app.use((err, req, res, next) => {
    if(err.status === 400){
        res.status(400).send(({msg: err.msg}))
    } else {
        next (err)
    }
})

app.use((err, req, res, next) => {
    if(err.status === 404){
        res.status(404).send(({msg: err.msg}))
    } else {
        next (err)
    }
})


app.use((err, req, res, next) => {
    if(err.code === '22P02' || err.code === '23502'){
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





module.exports = app;

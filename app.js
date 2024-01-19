const express = require("express");

const articleRouter = require("./routers/articles.router")
const userRouter = require("./routers/users.router")
const topicsRouter = require("./routers/topics.router")
const commentRouter = require("./routers/comments.router")
const apiRouter = require("./routers/api.router")

const app = express();

app.use(express.json());


app.use("/api/articles", articleRouter);
app.use("/api/users", userRouter)
app.use("/api/topics", topicsRouter)
app.use("/api/comments", commentRouter)
app.use("/api", apiRouter)


app.all("*", (req, res, next) => {
    res.status(404).send({ msg: "Invalid endpoint" })
})

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
    if(err.code === '23505'){
        res.status(400).send(({msg: err.detail}))
    } else {
        next (err)
    }
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send(({msg: "Internal error"}))
})




module.exports = app;

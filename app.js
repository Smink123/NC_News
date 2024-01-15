const express = require("express")
const { retrieveTopics } = require("./controllers/topics.controllers")

const app = express()

app.use(express.json())

app.get("/api/topics", retrieveTopics)

app.use((req, res, next) => {
        res.status(404).send({ msg: "Invalid endpoint" })

})

module.exports = app
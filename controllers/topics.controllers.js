const { fetchTopicData, addNewTopic } = require("../models/topics.models")

exports.retrieveTopics = (req, res, next) => {
    fetchTopicData().then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postNewTopic = (req, res, next) => {
    const { body } = req
    addNewTopic(body).then((topic) => {
        console.log(topic)
        res.status(201).send({ topic })
    })
    .catch((err) => {
        next(err)
    })
}

const { fetchTopicData } = require("../models/topics.models")

exports.incorrectPathNames = (req, res, next) => {
    res.status(404).send({ msg: "Invalid endpoint" });
};

exports.retrieveTopics = (req, res, next) => {
    fetchTopicData().then((topicsArray) => {
        res.status(200).send({ topicsArray })
    })
    .catch((err) => {
        next(err)
    })

}


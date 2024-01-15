const { fetchTopicData } = require("../models/topics.models")

exports.incorrectPathNames = (req, res, next) => {
    res.status(404).send({ msg: "Invalid endpoint" });
};

exports.retrieveTopics = (req, res, next) => {
    fetchTopicData().then((topicsArray) => {
        console.log(topicsArray)
        res.status(200).send({ topicsArray })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

}


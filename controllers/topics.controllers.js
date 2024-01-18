const { fetchTopicData } = require("../models/topics.models")

// exports.incorrectPathNames = (req, res, next) => {
//     res.status(404).send({ msg: "Invalid endpoint" });
// };

exports.retrieveTopics = (req, res, next) => {
    fetchTopicData().then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err)
    })

}


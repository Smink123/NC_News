const db = require("../db/connection")

exports.fetchTopicData = () => {
    return db.query(`SELECT * FROM topics`)
    .then((topicsArray) => {
            return topicsArray.rows
    })
}
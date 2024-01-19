const db = require("../db/connection");

exports.fetchTopicData = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};

exports.addNewTopic = (body) => {
  if (body.description === "" || body.slug === "") {
    return Promise.reject({ status: 400, msg: "Bad request: empty input" });
  }
  return db
    .query(
      `INSERT INTO topics (description, slug)
        VALUES ($1, $2)
        RETURNING *`,[body.description, body.slug]
    )
    .then((topic) => {
      if (topic.rows[0].description === null || topic.rows[0].slug === null) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return topic.rows[0];
    });
};

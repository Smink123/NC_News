const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT
    articles.article_id,
    articles.author,
    articles.title,
    articles.body,
    articles.created_at,
    articles.topic,
    articles.article_img_url,
    articles.votes,
    COUNT(comments.article_id)::INTEGER AS comment_count
    FROM articles
    FULL JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "ID not found",
        });
      }
      return article.rows[0];
    });
};
exports.fetchAllArticles = (topic) => {

  let queryString = `SELECT
  articles.article_id,
  articles.author,
  articles.title,
  articles.topic,
  articles.created_at,
  articles.article_img_url,
  articles.votes,
  COUNT(comments.article_id)::INTEGER AS comment_count
  FROM articles
  FULL JOIN
  comments ON articles.article_id = comments.article_id`;

  const queryParams = [];

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  queryString += ` GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  return db.query(queryString, queryParams).then((result) => {

    return result.rows;
  });
};

exports.fetchCommentByArticleId = (article_id) => {
  return db.query(`SELECT * FROM comments 
  WHERE article_id = $1
  ORDER BY created_at DESC`, [article_id]).then((comments) => {
    return comments.rows
  })
}

exports.postCommentToArticle = (article_id, body) => {
  const commentValues = [body.body, body.author, article_id, 0, "2020-07-18T11:23:00.000Z"]
  return db.query(`INSERT INTO comments
  (body, author, article_id, votes, created_at)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *`, commentValues).then((comment) => {
    return comment.rows[0].body
  })

}

exports.editArticleById = (article_id, inc_votes) => {
  return db.query(`UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *`
  , [inc_votes, article_id])
  .then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'ID not found' })
    }
    return article.rows[0]
  })
}
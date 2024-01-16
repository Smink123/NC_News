const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
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

exports.fetchAllArticles = () => {
  return db.query(`SELECT
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
                  comments ON articles.article_id = comments.article_id
                  GROUP BY articles.article_id
                  ORDER BY articles.created_at DESC`).then((articles) => {
                  return articles.rows;
               });
}

exports.fetchCommentByArticleId = (article_id) => {
  return db.query(`SELECT * FROM comments 
  WHERE article_id = $1
  ORDER BY created_at DESC`, [article_id]).then((comments) => {
    if (comments.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "ID not found"
      })
    }
    return comments.rows
  })
}

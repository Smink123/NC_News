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


exports.fetchAllArticles = (topic, order = 'DESC', sort_by = 'created_at', limit = 10, p = 1) => {

  const validOrderQueries = ['ASC', 'asc', 'DESC', 'desc'];
  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad request: Invalid order query' });
  }

  const validSortQueries = ['title', 'created_at', 'article_id', 'topic', 'author', 'body', 'votes', 'article_img_url', 'comment_count'];
  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort-by query' });
  }

  let queryString = `SELECT
    articles.article_id,
    articles.author,
    articles.title,
    articles.topic,
    articles.body,
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

  if (sort_by === 'comment_count') {
    queryString += ` GROUP BY articles.article_id
    ORDER BY COUNT(comments.article_id) ${order.toUpperCase()}
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  } else {
    queryString += ` GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order.toUpperCase()}
    LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  }

  queryParams.push(limit);
  queryParams.push((p - 1) * limit);

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
  if (body.body === '') {
    return Promise.reject({ status: 400, msg: 'Bad request: empty body' })
  }
  return db.query(`SELECT * FROM users WHERE username = $1`, 
  [body.username]).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'username not found' })
    }
  }).then(() => {
    const commentValues = [body.body, body.username, article_id]
    return db.query(`INSERT INTO comments
    (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING *`, commentValues).then((comment) => {
      return comment.rows[0].body
  })
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

exports.createaNewArticle = (body) => {

  if (body.body === '' || body.title === '' || body.author == '' || body.topic == '') {
    return Promise.reject({ status: 400, msg: 'Bad request: empty input' })
  }
  const articleValues = [body.title, body.topic, body.author, body.body]

  if (body.article_img_url === '') {
    articleValues.push('https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')
  } else {
    articleValues.push(body.article_img_url)
  }

  return db.query(`INSERT INTO articles
  (title, topic, author, body, article_img_url)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING article_id`, articleValues).then((article) => {
    const newArticleId = article.rows[0].article_id

    return db.query(`SELECT
    articles.article_id,
    articles.author,
    articles.title,
    articles.body,
    articles.article_img_url,
    articles.topic,
    articles.created_at,
    articles.votes,
    COUNT(comments.article_id)::INTEGER AS comment_count
    FROM articles
    FULL JOIN
    comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [newArticleId]).then((result) => {

      return result.rows[0]
    })
  })

}

exports.deleteAnArticle = (article_id) => {

  return db.query(`DELETE FROM comments
  WHERE article_id = $1`, [article_id]).then(() => {
    return db.query(`DELETE FROM articles
    WHERE article_id = $1`, [article_id]).then((response) => {
    if (response.rowCount === 0) {
        return Promise.reject({status: 404, msg: "ID not found"})
    } else {
    }
})
  })
}
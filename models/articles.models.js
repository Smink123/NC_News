const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchArticleById = (article_id) => {
  return fs.readFile("./endpoints.json", "utf-8").then((fileContents) => {
    const previousEndpoints = JSON.parse(fileContents);

    const newFileContent = {
      "GET /api/articles/:article_id": {
        description:
          "serves an object of the specified article with key information",
        queries: ["author", "topic", "sort_by", "order"],
        exampleResponse: {
          article_id: 12,
          title: "Moustache",
          topic: "mitch",
          author: "butter_bridge",
          body: "Have you seen the size of that thing?",
          created_at: "2020-10-11T11:24:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      },
    };
    const updatedEndPoints = { ...previousEndpoints, ...newFileContent };
    return fs.writeFile("./endpoints.json", JSON.stringify(updatedEndPoints, null, 2),"utf-8").then(() => {
        return db.query(`SELECT * FROM articles WHERE article_id = $1`, [
          article_id,
        ]);
      })
      .then((article) => {
        if (article.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Invalid get request: ID not found",
          });
        }
        return article.rows[0];
      });
  });
};

exports.fetchAllArticles = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((fileContents) => {
    const previousEndpoints = JSON.parse(fileContents);

    const newFileContent = {
      "GET /api/articles": {
        description: "serves an array of all articles as objects",
        queries: [],
        exampleResponse: {
          article_id: 11,
          author: "icellusedkars",
          title: "Am I a cat?",
          topic: "mitch",
          created_at: "2020-01-15T22:21:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 0,
          comment_count: 0,
        },
      },
    };

    const updatedEndPoints = { ...previousEndpoints, ...newFileContent };
    return fs
      .writeFile(
        "./endpoints.json",
        JSON.stringify(updatedEndPoints, null, 2),
        "utf-8"
      )
      .then(() => {
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
                        ORDER BY articles.created_at DESC`)
                     }).then((articles) => {
                        return articles.rows;
                     });
                  });
};

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

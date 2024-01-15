const db = require("../db/connection");
const fs = require("fs/promises")

exports.fetchArticleById = (article_id) => {
   return fs.readFile('./endpoints.json', 'utf-8').then((fileContents) => {
      const previousEndpoints = JSON.parse(fileContents)

      const newFileContent = { 
         'GET /api/articles/:article_id': {
            description: 'serves an object of the specified article with key information',
            queries: [ 'author', 'topic', 'sort_by', 'order' ],
            exampleResponse: {
               article_id: 12,
               title: "Moustache",
               topic: "mitch",
               author: "butter_bridge",
               body: "Have you seen the size of that thing?",
               created_at: "2020-10-11T11:24:00.000Z",
               votes: 0,
               article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"}
         }
      }
      const updatedEndPoints = {...previousEndpoints, ...newFileContent }

      return fs.writeFile("./endpoints.json", JSON.stringify(updatedEndPoints, null, 2), "utf-8").then(() => {
         return db
           .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])

      })
        .then((article) => {
          if (article.rows.length === 0) {
            return Promise.reject({
              status: 404, msg: "Invalid get request: ID not found"});
          }
          return article.rows[0];
        });

   })
};

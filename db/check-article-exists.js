const db = require("../db/connection");

function checkArticlesExists(article_id) {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'ID not found'})
        }
    })
}

module.exports = { checkArticlesExists }
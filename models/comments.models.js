const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments
    WHERE comment_id = $1`, [comment_id]).then((response) => {
        if (response.rowCount === 0) {
            return Promise.reject({status: 404, msg: "ID not found"})
        } else {
        }
    })
}

exports.updateVotesComment = (comment_id, inc_votes) => {
    return db.query(`UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`, [inc_votes, comment_id]).then((comment) => {
        if (comment.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'comment ID not found' })
          }
        return comment.rows[0]
    })

}
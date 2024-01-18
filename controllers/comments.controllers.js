const { removeCommentById, updateVotesComment } = require("../models/comments.models")

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    removeCommentById(comment_id).then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

exports.editVotesOnComment = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    updateVotesComment(comment_id, inc_votes).then((comment) => {
        res.status(200).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}
const commentRouter = require("express").Router()

const { deleteCommentById, editVotesOnComment } = require("../controllers/comments.controllers")

commentRouter.route("/:comment_id")
    .delete(deleteCommentById)
    .patch(editVotesOnComment)

module.exports = commentRouter;



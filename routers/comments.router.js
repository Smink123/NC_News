const commentRouter = require("express").Router()

const { deleteCommentById } = require("../controllers/comments.controllers")

commentRouter.route("/:comment_id")
    .delete(deleteCommentById)

module.exports = commentRouter;



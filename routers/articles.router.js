const articleRouter = require("express").Router()

const { retrieveArticleById, retrieveAllArticles, retrieveCommentsByArticleId, postNewComment, patchArticleById } = require("../controllers/articles.controllers")

articleRouter.route("/:article_id")
    .get(retrieveArticleById)
    .patch(patchArticleById)

articleRouter.route("/")
    .get(retrieveAllArticles)

articleRouter.route("/:article_id/comments")
    .get(retrieveCommentsByArticleId)
    .post(postNewComment)


module.exports = articleRouter;

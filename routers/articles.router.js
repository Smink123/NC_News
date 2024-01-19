const articleRouter = require("express").Router()

const { retrieveArticleById, retrieveAllArticles, retrieveCommentsByArticleId, postNewComment, patchArticleById, postaNewArticle, removeArticle } = require("../controllers/articles.controllers")

articleRouter.route("/:article_id")
    .get(retrieveArticleById)
    .patch(patchArticleById)
    .delete(removeArticle)

articleRouter.route("/")
    .get(retrieveAllArticles)
    .post(postaNewArticle)

articleRouter.route("/:article_id/comments")
    .get(retrieveCommentsByArticleId)
    .post(postNewComment)


module.exports = articleRouter;

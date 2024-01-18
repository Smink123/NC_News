const articleRouter = require("express").Router()

const { retrieveArticleById, retrieveAllArticles, retrieveCommentsByArticleId, postNewComment, patchArticleById } = require("../controllers/articles.controllers")

articleRouter.get("/:article_id", retrieveArticleById)
articleRouter.get("/", retrieveAllArticles)
articleRouter.get("/:article_id/comments", retrieveCommentsByArticleId)
articleRouter.post("/:article_id/comments", postNewComment)
articleRouter.patch("/:article_id", patchArticleById)



module.exports = articleRouter;

const { fetchArticleById, fetchAllArticles, fetchCommentByArticleId, postCommentToArticle, editArticleById } = require("../models/articles.models")

exports.retrieveArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.retrieveAllArticles = (req, res, next) => {
    const { topic } = req.query
    fetchAllArticles(topic).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

exports.retrieveCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    fetchCommentByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postNewComment = (req, res, next) => {
    const { article_id } = req.params
    const { body } = req

    postCommentToArticle(article_id, body).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    editArticleById(article_id, inc_votes).then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}
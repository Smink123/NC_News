const { fetchArticleById, fetchAllArticles, fetchCommentByArticleId, postCommentToArticle, editArticleById, createaNewArticle } = require("../models/articles.models")
const { checkArticlesExists } = require("../db/check-article-exists")
const { checkTopicExists } = require("../db/check-topic-exists")




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
    const { topic, order, sort_by } = req.query

    const fetchQuery = fetchAllArticles(topic, order, sort_by)
    const queries = [fetchQuery]

    if (topic) {
        const topicExistsQuery = checkTopicExists(topic)
        queries.push(topicExistsQuery)
    }
    Promise.all(queries).then((response) => {
        const articles = response[0]
        res.status(200).send({ articles })
    })
    .catch((err) => {
        next(err)
    })
}

exports.retrieveCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params

    const fetchQuery = fetchCommentByArticleId(article_id)
    const queries = [fetchQuery]
    
    if (article_id) {
        const articleExistsQuery = checkArticlesExists(article_id)
        queries.push(articleExistsQuery)
    }

    Promise.all(queries).then((response) => {
        const comments = response[0]
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

exports.postaNewArticle = (req, res, next) => {
    const { body } = req
    createaNewArticle(body).then((article) => {
        res.status(201).send({ article })
    })
}
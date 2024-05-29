const { selectArticleById, selectAllArticles, selectArticleComments} = require ('../models/articles.model')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    }).catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles().then((articles) => {
        res.status(200).send({ articles })
    }).catch((err) => {
        next(err)
    })
}

exports.getArticleComments = (req, res, next) => {
    selectArticleComments().then((comments) => {
        res.status(200).send({ comments: comments })
    }).catch((err) => {
        next(err)
    })
}
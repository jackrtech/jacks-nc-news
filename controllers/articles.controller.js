const { selectArticleById, selectAllArticles, selectArticleComments, insertArticleComments } = require('../models/articles.model')

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
    const { article_id } = req.params;
    selectArticleComments(article_id).then((comments) => {
        res.status(200).send({ comments })
    }).catch((err) => {
        next(err)
    })
}

exports.postArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    console.log('CONTROLLER 1')

    insertArticleComments(article_id, username, body)
        .then((comment) => {
            console.log('CONTROLLER 2')
            console.log(comment)
            res.status(201).send({ comment });
        }).catch(next);
};
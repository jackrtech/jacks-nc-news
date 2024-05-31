const { getAllUsers, selectArticleById, selectAllArticles, updateArticleVotes } = require('../models/articles.model')


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            if (!article) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            res.status(200).send({ article });
        })
        .catch(next);
};


exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};


exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { votes } = req.body;

    if (typeof votes !== 'number') {
        return res.status(400).send({ msg: 'Invalid Votes Value' });
    }

    updateArticleVotes(article_id, votes)
        .then((result) => {
            if (result.error) {
                res.status(result.error.status).send({ msg: result.error.msg });
            } else {
                res.status(200).send({ article: result });
            }
        })
        .catch(next);
};



exports.getAllUsers = (req, res, next) => {
    getAllUsers()
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
};
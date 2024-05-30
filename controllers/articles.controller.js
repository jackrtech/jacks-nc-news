const { selectArticleById, selectAllArticles, selectArticleComments, insertArticleComments, updateArticleVotes } = require('../models/articles.model')


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    }).catch((err) => {
        next(err)
    });
};


exports.getAllArticles = (req, res, next) => {
    selectAllArticles().then((articles) => {
        res.status(200).send({ articles })
    }).catch((err) => {
        next(err)
    });
};

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleComments(article_id).then((comments) => {
        res.status(200).send({ comments })
    }).catch((err) => {
        next(err)
    });
};


exports.postArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    //console.log(article_id, username, body)
    const validUsernames = ['butter_bridge', 'icellusedkars', 'rogersop', 'lurker']
    if (!validUsernames.includes(username)) {
        return res.status(400).send({ msg: 'Invalid username' });
    }

    insertArticleComments(article_id, username, body)
        .then((comment) => {
            //console.log(comment, '<CONTROLLER')
            res.status(201).send({ comment });
        }).catch(next);
};


exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { votes } = req.body;

    if (typeof votes !== 'number') {
        return res.status(400).send({ msg: 'Invalid Votes Value' });
    }

    

    updateArticleVotes(article_id, votes)
        .then((updatedArticle) => {
            res.status(200).send({ article: updatedArticle });
        })
        .catch(next);
};
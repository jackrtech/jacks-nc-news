const { deleteComment, selectArticleComments, insertArticleComments } = require('../models/comments.model')

exports.deleteCommentController = (req, res, next) => {
    const { comment_id } = req.params;

    deleteComment(comment_id)
        .then((result) => {
            if (result && result.error) {
                res.status(result.error.status).send({ msg: result.error.msg });
            } else {
                res.status(204).send();
            }
        })
        .catch(next);
};

exports.postArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    insertArticleComments(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            if (err.code === '23503' || err.code === '23505') {
                next({ status: 404, msg: 'Article Not Found' });
            } else {
                next(err);
            }
        });
};

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleComments(article_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch(next);
};

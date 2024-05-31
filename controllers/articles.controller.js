const { deleteComment, selectArticleById, selectAllArticles, selectArticleComments, insertArticleComments, updateArticleVotes } = require('../models/articles.model')


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


exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleComments(article_id)
        .then((comments) => {
            res.status(200).send({ comments });
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
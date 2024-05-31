const express = require('express')
const app = express()
const { getAllTopics } = require('../controllers/topics.controller')
const { getEndpoints } = require('../controllers/endpoints.controller')
const { getAllUsers, getArticleById, getAllArticles, patchArticleVotes } = require('../controllers/articles.controller')
const { deleteCommentController, getArticleComments, postArticleComments } = require ('../controllers/comments.controller')
app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', postArticleComments)

app.patch('/api/articles/:article_id', patchArticleVotes);

app.delete('/api/comments/:comment_id', deleteCommentController);

app.get('/api/users', getAllUsers);

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid Input' });
  } else if (err.code === '23502') {
    res.status(400).send({ msg: 'Required Key Missing' });
  } else if (err.code === '23503') {
    res.status(400).send({ msg: 'Not Found' });
  } else if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
})



module.exports = { app }
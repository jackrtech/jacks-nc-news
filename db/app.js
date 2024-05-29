const express = require('express')
const app = express()
const { getAllTopics } = require('../controllers/topics.controller')
const { getEndpoints } = require('../controllers/endpoints.controller')
const { getArticleById, getAllArticles, getArticleComments } = require('../controllers/articles.controller')


app.get('/api/topics', getAllTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('api/articles/:article_id/comments', getArticleComments)


app.use((err, req, res, next) => {
    if(err.code === '22P02') {
      res.status(400).send({ msg: 'Bad request' })
      next()
    }
    next(err)
  })


app.use((err, req, res, next) => {
    if(err.msg) {
      res.status(404).send({ msg: err.msg })
      next()
    }
    next(err)
  })


app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error'})
  })


module.exports = { app }
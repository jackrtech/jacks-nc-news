const express = require('express')
const app = express()
const { getAllTopics } = require('../controllers/topics.controller')
const { getEndpoints } = require('../controllers/endpoints.controller')
const { getArticleById, getAllArticles, getArticleComments, postArticleComments } = require('../controllers/articles.controller')

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getArticleComments)



app.use('/api/articles/:article_id/comments', postArticleComments)


app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid Input' })
  } else if (err.code === '23502') {
    res.status(400).send({ msg: 'Required Key Missing' })
  } else {
    next(err)
  } 

})


app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(404).send({ msg: err.msg })
  } else {
    next(err)
  }
})


app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: 'Internal ServRRRRRRRer Error' })
})


module.exports =  { app }
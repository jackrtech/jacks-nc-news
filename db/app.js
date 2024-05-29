const express = require('express')
const app = express()
const { getAllTopics } = require('../controllers/topics.controller')
const { getEndpoints } = require('../controllers/endpoints.controller')


app.get('/api/topics', getAllTopics)
app.get('/api', getEndpoints)
module.exports = { app }
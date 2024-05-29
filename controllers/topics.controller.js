const topics = require('../db/data/test-data/topics')
const { selectTopics } = require ('../models/topics.model')

exports.getAllTopics = (req, res) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics: topics})
    })
}
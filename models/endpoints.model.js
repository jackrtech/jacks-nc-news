const db = require('../db/connection')

exports.viewEndpoints = () => {
    return db.query('SELECT * FROM nc_news')
}
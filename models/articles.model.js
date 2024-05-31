const db = require('../db/connection')

exports.selectArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                //console.log(result.rows,'if statement <<<<<<')
                return Promise.reject({ status: 404, msg: 'article does not exist' })
            }
            //console.log(result, '<<<<<<<<<<<<')
            return result.rows[0]
        })
}

exports.selectAllArticles = () => {
    return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`)
        .then((result) => {
            return result.rows
        })
}

exports.selectArticleComments = (article_id) => {
    return db.query(`
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`, [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' })
            }
            return result.rows
        })
}

exports.insertArticleComments = (article_id, author, body) => {
    return db.query(`
    INSERT INTO comments(article_id, author, body) 
    VALUES($1, $2, $3) 
    RETURNING *`,
    [article_id, author, body])
        .then((result) => {

            return result;
        })
};
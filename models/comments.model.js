const db = require('../db/connection')

exports.deleteComment = (comment_id) => {
    return db.query(`
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;`,
        [comment_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return { error: { status: 404, msg: 'Comment Not Found' } };
            }
        });
};

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
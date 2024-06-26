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




exports.selectAllArticles = (topic) => {
    let query = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `;

    const queryParams = [];

    if (topic) {
        query += ` WHERE articles.topic = $1 `;
        queryParams.push(topic);
    }

    query += `
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `;

    return db.query(query, queryParams)
        .then((result) => {
            return result.rows;
        })
        .catch((error) => {
            console.error('Database Error:', error);
            return Promise.reject({ status: 500, msg: 'Internal Server Error' });
        });
};




exports.updateArticleVotes = (article_id, inc_votes) => {
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
        [inc_votes, article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                console.log('MODEL ERROR')
                return { error: { status: 404, msg: 'Article Not Found' } };
            }
            return result.rows[0];
        });
};


exports.getAllUsers = () => {
    return db.query(`
      SELECT username, name, avatar_url
      FROM users;
    `)
        .then((result) => {
            return result.rows;
        });
};
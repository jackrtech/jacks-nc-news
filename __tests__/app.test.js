const request = require('supertest');
const { app } = require('../app');
const db = require('../db/connection');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const endpoints = require('../endpoints.json');
const { selectAllArticles } = require('../models/articles.model');
require('jest-sorted');


beforeEach(() => {
    return seed(data);
});


afterAll(() => {
    db.end();
});


describe('GET /api/topics', () => {
    test('GET:200 Responds with an array containing the topics', () => {
        return request(app)
            .get('/api/topics').expect(200).then(({ body }) => {
                expect(body.topics.length > 0).toBe(true)
                body.topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            description: expect.any(String),
                            slug: expect.any(String)
                        }));
                });
            });
    });
});


describe('GET /api', () => {
    test('GET:200 Responds with an object containing a description of all available endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body.endpoints).toEqual(endpoints)
            })
    })
})


describe('GET /api/articles/:article_id', () => {
    test('GET:200 Responds with an article object containing the correct data', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(1)
                expect(body.article.title).toBe('Living in the shadow of a great man')
                expect(body.article.topic).toBe('mitch')
                expect(body.article.author).toBe('butter_bridge')
                expect(body.article.body).toBe('I find this existence challenging')
                expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z')
                expect(body.article.votes).toBe(100)
                expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
            })
    })

    test('GET:200 Responds with an article object containing the correct data', () => {
        return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(3)
                expect(body.article.title).toBe("Eight pug gifs that remind me of mitch")
                expect(body.article.topic).toBe('mitch')
                expect(body.article.author).toBe('icellusedkars')
                expect(body.article.body).toBe('some gifs')
                expect(body.article.created_at).toBe('2020-11-03T09:12:00.000Z')
                expect(body.article.votes).toBe(0)
                expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
            })
    })

    test('GET:404 Responds an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('article does not exist');
            });
    })
    test('GET:400 Responds with an appropriate status and error message when given an invalid id', () => {
        return request(app)
            .get('/api/articles/not-a-article')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid Input');
            });
    });
})

describe('GET /api/articles', () => {
    test('GET:200 Responds with an array of article objects', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13);
                body.articles.forEach((article) => {
                    expect(typeof article.article_id).toBe('number'),
                        expect(typeof article.title).toBe('string'),
                        expect(typeof article.topic).toBe('string'),
                        expect(typeof article.author).toBe('string'),
                        expect(typeof article.created_at).toBe('string'),
                        expect(typeof article.votes).toBe('number'),
                        expect(article.article_img_url.startsWith('https://')).toBe(true),
                        expect(typeof article.comment_count).toBe('string'),
                        expect(article).not.toHaveProperty('body')
                })
            })
    })

    test('Responds with articles sorted by created_at in descending order', () => {
        return selectAllArticles()
            .then((result) => {
                expect(result).toBeSortedBy('created_at', { descending: true });
            });
    });

    test('GET:200 Responds with articles filtered by topic when topic query is provided', () => {
        const topic = 'mitch'; 
        
        return request(app)
            .get('/api/articles')
            .query({ topic })
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length > 0).toBe(true);
                body.articles.forEach((article) => {
                    expect(article.topic).toBe(topic);
                });
            });
    });

    test('GET:404 Responds with 404 when no articles match the provided topic', () => {
        const nonExistentTopic = 'nonexistenttopic'; 
        
        return request(app)
            .get('/api/articles')
            .query({ topic: nonExistentTopic })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No articles found for this topic');
            });
    });
})


describe('GET /api/articles/article_id/comments', () => {

    test('GET:200 Responds array of correct data types for comment object ', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.comments)).toBe(true)
                expect(body.comments.length > 0).toBe(true)
                body.comments.forEach(comment => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            article_id: expect.any(Number),
                        })
                    );
                });
            })
    })

    test('GET:200 Responds array of correct comments for selected article', () => {
        return request(app)
            .get('/api/articles/6/comments')
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.comments)).toBe(true)
                body.comments.forEach(comment => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: 16,
                            votes: 1,
                            created_at: '2020-10-11T15:23:00.000Z',
                            author: 'butter_bridge',
                            body: 'This is a bad article name',
                            article_id: 6,
                        })
                    );
                });
            })
    })

    test('GET:404 Responds with 404 for a non-existing article ID', () => {
        return request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });

    test('GET:400 Responds with 400 for an invalid article ID', () => {
        return request(app)
            .get('/api/articles/hello/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid Input');
            });
    });
})


describe('POST /api/articles/:article_id/comments', () => {

    test('POST:201 Responds with the correct posted comment', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({ username: 'butter_bridge', body: 'this is a comment' })
            .expect(201)
            .then(({ body }) => {
                expect(body.comment.rows[0].body).toBe('this is a comment')
                expect(body.comment.rows[0].author).toBe('butter_bridge')

            });
    });


    test('POST:201 Responds with the correct posted comment', () => {
        return request(app)
            .post('/api/articles/2/comments')
            .send({ username: 'butter_bridge', body: 'this is another comment' })
            .expect(201)
            .then(({ body }) => {
                expect(body.comment.rows[0].body).toBe('this is another comment')
                expect(body.comment.rows[0].author).toBe('butter_bridge')
            });
    });

    test('POST:400 Responds with an error message when request body is incomplete', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({ username: 'butter_bridge' })
            .expect(400)
            .then(({ body }) => {
                expect(body).toHaveProperty('msg', 'Required Key Missing');
            });
    });

    test('POST:404 Responds with error when username is invalid', () => {
        return request(app)
            .post('/api/articles/1/comments')
            .send({ username: 'not_a_user', body: 'this is a comment' })
            .expect(404)
            .then(({ body }) => {
                expect(body).toHaveProperty('msg', 'Article Not Found');
            });
    });

    test('POST:400 Responds with error message when given invalid article id', () => {
        return request(app)
            .post('/api/articles/thisisaword/comments')
            .send({ username: 'butter_bridge', body: 'this is a comment' })
            .expect(400)
            .then(({ body }) => {
                expect(body).toHaveProperty('msg', 'Invalid Input');
            });
    });

    test('POST:404 Responds with error message when given a article id that doesnt exist', () => {
        return request(app)
            .post('/api/articles/999999999/comments')
            .send({ username: 'butter_bridge', body: 'this is a comment' })
            .expect(404)
            .then(({ body }) => {
                expect(body).toHaveProperty('msg', 'Article Not Found');
            });
    });
});


describe('PATCH /api/articles/:article_id', () => {
    test('PATCH:200 Responds with the article when votes are incremented', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toHaveProperty('article_id', 1);
                expect(body.article).toHaveProperty('votes', expect.any(Number));
            });
    });

    test('PATCH:200 Responds with the article when votes are decreased', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ votes: -22 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toHaveProperty('article_id', 1);
                expect(body.article).toHaveProperty('votes', expect.any(Number));
            });
    });


    test('PATCH:400 Responds with error message when the votes is not a number', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ votes: 'this is not a voteeee' })
            .expect(400)
            .then(({ body }) => {
                expect(body).toHaveProperty('msg', 'Invalid Votes Value');
            });
    });


    test('PATCH:404 Responds with error when article id does not exist', () => {
        return request(app)
            .patch('/api/articles/999999999')
            .send({ votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body).toHaveProperty('msg', 'Article Not Found');
            });
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    
    test('DELETE:204 Responds by not finding the comment after the comment has been deleted', () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204);
    });

    test('DELETE:404 Responds with an error when the comment_id doesnt exist', () => {
        return request(app)
            .delete('/api/comments/999999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment Not Found');
            });
    });

    test('DELETE:400 Responds with error when the comment_id is invalid', () => {
        return request(app)
            .delete('/api/comments/invalid-id')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid Input');
            });
    });
});

describe('GET /api/users', () => {
    test('GET:200 Responds with an array of users', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.users)).toBe(true);
                expect(body.users.length > 0).toBe(true);
                body.users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    );
                });
            });
    });
});

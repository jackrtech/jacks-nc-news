const request = require('supertest')
const { app } = require('../db/app')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')


beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

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
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then((response) => {
                //console.log(response.body, 'body<<<<<<<<')
                expect(response.body.msg).toBe('article does not exist');
            });
    })
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
            .get('/api/articles/not-a-article')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request');
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
})

describe('GET /api/articles/article_id/comments', () => {
    test('GET:200 Responds array of comments for select article', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => [
            console.log(body)
        ])
    })
})
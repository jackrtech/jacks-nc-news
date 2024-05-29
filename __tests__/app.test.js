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
    test('Responds with an array containing the topics', () => {
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
    test('Responds with an object containing a description of all available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})
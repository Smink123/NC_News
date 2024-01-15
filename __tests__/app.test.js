const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const fs = require('fs/promises');

beforeAll(() => seed(data))

afterAll(() => db.end())

describe('GET/incorrect file path', () => {
    test("404: Should respond with a status code of 404 for an endpoint that doesn't exist", () => {
        return request(app)
            .get("/api/incorrectpath")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid endpoint");
            });
    });
})

describe("GET/topics", () => {
    test("200: Should respond with an array of objects containing topic data, with each object to contain a key of 'slug' and 'description'", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            const { topics } = body;
            topics.forEach((topic) => {
                expect(typeof topic.slug).toBe("string")
                expect(typeof topic.description).toBe("string")
            })
            expect(topics.length).toBe(3)
        })
    })
})

describe("GET/api", () => {
    test("200: when calling the api as the endpoint, return an object containing all of the endpoint information for every endpoint tested in app.js", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            const { endpointObject } = body
            return fs.readFile('./endpoints.json', 'utf-8')
                .then((fileContents) => {
                    const parsedFile = JSON.parse(fileContents)
                    expect(endpointObject).toEqual(parsedFile)
                })
        })
    })
    test("200: For each endpoint, make sure that all of the required information and keys are there", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                const { endpointObject } = body;
                expect(endpointObject["GET /api/topics"].exampleResponse).not.toBeUndefined();
                expect(endpointObject["GET /api/topics"].description).not.toBeUndefined();
                expect(endpointObject["GET /api/topics"].queries).not.toBeUndefined();
    
                expect(endpointObject["GET /api/articles"].description).not.toBeUndefined();
                expect(endpointObject["GET /api/articles"].queries).not.toBeUndefined();
                expect(endpointObject["GET /api/articles"].exampleResponse).not.toBeUndefined();
            });
    });
})

//retrieving by their id number
describe("GET /api/articles/:article_id", () => {
    test("200: when retrieving an article by an id number of 1, return the correct article information as an object", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            const { article } = body;
            const expectedArticle = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }
            expect(article).toEqual(expectedArticle)
        })
    })
    test("200: when retrieving an article by a valid id number (but this time more large), return the correct article information as an object", () => {
        return request(app)
        .get("/api/articles/12")
        .expect(200)
        .then(({ body }) => {
            const { article } = body;
            const expectedArticle = {
                article_id: 12,
                title: "Moustache",
                topic: "mitch",
                author: "butter_bridge",
                body: "Have you seen the size of that thing?",
                created_at: "2020-10-11T11:24:00.000Z",
                votes: 0,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"}
            expect(article).toEqual(expectedArticle)
        })
    })
    test("404: when given an article_id number which is not in the database, return an error message", () => {
        return request(app)
        .get("/api/articles/65")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid get request: ID not found');
        })
    })
    test("400: when given an article_id value which is not a number, return a bad request error message", () => {
        return request(app)
        .get("/api/articles/twenty")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
        })
    })
})
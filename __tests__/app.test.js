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
            console.log('topic check: ', topics)
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
const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")

beforeAll(() => seed(data))

afterAll(() => db.end())

describe("GET/topics", () => {
    test("200: Should respond with an array of objects containing topic data, with each object to contain a key of 'slug' and 'description'", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            const { topicsArray } = body;
            topicsArray.forEach((topic) => {
                expect(typeof topic.slug).toBe("string")
                expect(typeof topic.description).toBe("string")
            })
            expect(topicsArray[0].slug).toBe('mitch')
            expect(topicsArray[1].slug).toBe('cats')
            expect(topicsArray[2].slug).toBe('paper')
            expect(topicsArray[0].description).toBe('The man, the Mitch, the legend')
            expect(topicsArray[1].description).toBe('Not dogs')
            expect(topicsArray[2].description).toBe('what books are made of')
        })
    })
    test("404: Should respond with a status code of 404 for an endpoint that doesn't exist", () => {
        return request(app)
            .get("/api/some_random_word")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid endpoint");
            });
    });
    
    //we want to retrieve all topics
    //the response needs to be an array of objects with the following properties: slug, description
    //what errors could occur

    //make sure to add a 500 error, but this doesn't need to be tested
})
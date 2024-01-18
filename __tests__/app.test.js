const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const endpointFile = require('../endpoints.json')

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
            expect(endpointObject).toEqual(endpointFile)
        })
    })
})

describe('GET /api/articles', () => {
    test('200: returns an array of all article objects in descending order by date, and must include all of the relevant keys', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("created_at", { descending: true })
            articles.forEach(article => {
                expect(typeof article.author).toBe('string')
                expect(typeof article.title).toBe('string')
                expect(typeof article.article_id)
                expect(typeof article.topic).toBe('string')
                expect(typeof article.created_at).toBe('string')
                expect(typeof article.body).toBe('string')
                expect(typeof article.votes).toBe('number')
                expect(typeof article.article_img_url).toBe('string')
                expect(typeof article.comment_count).toBe('number')
            })
        })
    })
})
describe('GET /api/articles/:article_id/comments', () => {
    test('200: returns an array of comments which feature in a specific article, ordered by the most recently made comment', () => {
        return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({body}) => {
            const { comments } = body;
            const expectedOutput = [
                {
                    comment_id: 11,
                    votes: 0,
                    created_at: "2020-09-19T23:10:00.000Z",
                    author: "icellusedkars",
                    body: "Ambidextrous marsupial",
                    article_id: 3
                },
                {
                    comment_id: 10,
                    votes: 0,
                    created_at: "2020-06-20T07:24:00.000Z",
                    author: "icellusedkars",
                    body: "git push origin master",
                    article_id: 3
                }
            ];
            expect(comments).toEqual(expectedOutput)
            expect(comments).toBeSortedBy("created_at", { descending: true })
        });
    });
    test("404: when given an article_id number which is not in the database, return an error message", () => {
        return request(app)
        .get("/api/articles/87/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('ID not found');
        })
    })
    test("400: when given an article_id value which is not a number, return a bad request error message", () => {
        return request(app)
        .get("/api/articles/twenty_seven/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
        })
    })
    test('200: If the aticle_id exists but there are no comments, respond with an empty array', () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
            const { comments } = body;
            expect(comments).toEqual([]);
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('201: inserts a new comment into the specified article, and returns that newly added comment', () => {
        const commentToAdd = {
            body: 'this is a bunch of nonsense',
            username: "butter_bridge"
        }
        const addedComment = {
            body: 'this is a bunch of nonsense'
        }
        return request(app)
        .post('/api/articles/4/comments') 
        .send(commentToAdd) 
        .expect(201)
        .then(({body}) => {
            const { comment } = body
            expect(comment).toEqual(addedComment.body)
        })
    })
    test('400: when given an article_id value which is not a number, return a bad request error message', () => {
        const commentToAdd = {
            body: 'this is a bunch of nonsense',
            username: "butter_bridge"
        }
        return request(app)
        .post('/api/articles/four/comments') 
        .send(commentToAdd) 
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
        })
    })
    test('404: when given an article_id which does not exist in the database, return an ID does not exist message', () => {
        const commentToAdd = {
            body: 'this is a bunch of nonsense',
            username: "butter_bridge"
        }
        return request(app)
        .post('/api/articles/876/comments') 
        .send(commentToAdd) 
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('ID not found');
        })
    })
    test('400: when given an body value which is empty, return a bad request error message', () => {
        const commentToAdd = {
            body: '',
            username: "butter_bridge"
        }
        return request(app)
        .post('/api/articles/4/comments') 
        .send(commentToAdd) 
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request: empty body');
        })
    })
    test('404: when given a user that doesnt exist in the database, return a not found error', () => {
        const commentToAdd = {
            body: 'elo elo elo',
            username: "sminksmonk564"
        }
        return request(app)
        .post('/api/articles/4/comments') 
        .send(commentToAdd) 
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('username not found');
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test("200: when given a patch request to update the votes with a positive number for a specific article, update the article with the new value", () => {
        const newInfo = { inc_votes: 50 }

        const updatedArticle = {
            article_id: 7,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            author: "icellusedkars",
            body: "I was hungry.",
            created_at: "2020-01-07T14:08:00.000Z",
            title: 'Z',
            topic: "mitch",
            votes: 50
        }

        return request(app)
        .patch("/api/articles/7")
        .send(newInfo)
        .expect(200)
        .then(({ body }) => {
            const { article } = body
            expect(article).toEqual(updatedArticle)
        })
    })
    test("200: when given a patch request to update the votes with a negative number for a specific article, update the article with the new value", () => {
        const newInfo = { inc_votes: -40 }

        const updatedArticle = {
            article_id: 4,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: "2020-05-06T01:14:00.000Z",
            title: 'Student SUES Mitch!',
            topic: "mitch",
            votes: -40
        }

        return request(app)
        .patch("/api/articles/4")
        .send(newInfo)
        .expect(200)
        .then(({ body }) => {
            const { article } = body
            expect(article).toEqual(updatedArticle)
        })
    })
    test("404: when given an article id which is not included in the database, return an id not found message", () => {
        const newInfo = { inc_votes: 100 }

        return request(app)
        .patch("/api/articles/687")
        .send(newInfo)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("ID not found")
        })
    })
    test("400: when given an invalid article_id that is not a number, return a bad request message", () => {
        const newInfo = { inc_votes: 100 }
        return request(app)
        .patch("/api/articles/fifty")
        .send(newInfo)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    test("400: when given an invalid inc_votes value which is not a number, return a bad request message", () => {
        const newInfo = { inc_votes: 'one hundred' }
        return request(app)
        .patch("/api/articles/7")
        .send(newInfo)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    test("400: when given an invalid key that is not inc_votes, return a bad request message", () => {
        const newInfo = { update: 67 }
        return request(app)
        .patch("/api/articles/7")
        .send(newInfo)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request")
        })
    })
})

describe("DELETE /api/comments/:comment_id", () => {
    test('204: delete a comment by its comment id from the database', () => {
        return request(app)
        .delete("/api/comments/5")
        .expect(204)
        .then(({ body }) => {
            expect(body).toEqual({})
        })
    })
    test("404: when given a comment_id as a number which is not included in the database, return an error message", () => {
        return request(app)
        .delete("/api/comments/598")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("ID not found")
        })
      })
      test("400: when given an invalid id that is not a number, send back a bad request message", () => {
        return request(app)
        .delete("/api/comments/one")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request")
        })
      })
})

describe('GET /api/users', () => {
    test("200: responds with an array of user information, including their username, name and avatar url", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            const { users } = body
            expect(users.length).toBe(4)
            users.forEach((user) => {
                expect(typeof user.username).toBe("string")
                expect(typeof user.name).toBe("string")
                expect(typeof user.avatar_url).toBe("string")
            })
        })
    })
})

describe('GET /api/articles (topic query)', () => {
    test("200: Will return a filtered set of results based on the particular topic query given", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            articles.forEach((article) => {
                expect(article.topic).toBe('mitch')
            })
        })
    })
    test("404: returns a bad request error message if the topic query does not match any of the topics in the database", () => {
        return request(app)
        .get("/api/articles?topic=weather")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request: query does not exist')
    })
})
test("200: If a topic exists but isn't mentioned in any articles, return an empty array", () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({body}) => {
        const { articles } = body;
        expect(articles).toEqual([]);
        })
})
})

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
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                comment_count: 10
              }
            expect(article).toEqual(expectedArticle)
            expect(typeof article.comment_count).toBe('number')
        })
    })
    test("404: when given an article_id number which is not in the database, return an error message", () => {
        return request(app)
        .get("/api/articles/65")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('ID not found');
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

describe('GET api/articles (order)', () => {
    test('200: should order all results in ascending order when defined as an order query', () => {
        return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("created_at", { ascending: true })
    })
    })
    test('200: should order all results in descending order when defined as an order query', () => {
        return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("created_at", { descending: true })
    })
    })
    test('200: should default to descending order when no order query is given', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("created_at", { descending: true })
    })
    })
    test('400: returns an bad request message when an invalid order query is given', () => {
        return request(app)
        .get("/api/articles?order=random")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request: Invalid order query')
    })
    })
})
//will sort by column, by default in acscending order, for example article_id will be in order of numbers desc, body will be sorted in order alphabetically desc, 
describe('GET api/articles (sort_by)', () => {
    test('200: returns articles in order of the specified column name (title), by default of descending order', () => {
        return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("title", { descending: true })
    })
    })
    test('200: returns articles in order of the specified column name (topic), by default of descending order', () => {
        return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("topic", { descending: true })
    })
    })
    test('200: returns articles in order of the specified column name (article_id), by default of descending order', () => {
        return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("article_id", { descending: true })
    })
    })
    test('200: returns articles in order of the specified column name (author), by default of descending order', () => {
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("author", { descending: true })
    })
    })
    test('200: returns articles in order of the specified column name (votes), by default of descending order', () => {
        return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("votes", { descending: true })
    })
    })
    test('200: returns articles in order of the specified column name (article_img_url), by default of descending order', () => {
        return request(app)
        .get("/api/articles?sort_by=article_img_url")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("article_img_url", { descending: true })
    })
    })
    test('200: returns articles in order of the specified column name (created_at), by default of descending order', () => {
        return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("created_at", { descending: true })
    })
    })
    test('200: returns articles in order of the specified column name (comment_count), by default of descending order', () => {
        return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("comment_count", { descending: true })
    })
    })
    test('200: allow for multiple queires in a single enpath and reorder the data accordingly', () => {
        return request(app)
        .get("/api/articles?sort_by=comment_count&order=asc")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSortedBy("comment_count", { ascending: true })
    })
    })
    test('200: returns articles in order of the specified column name (body), by default of descending order', () => {
        return request(app)
        .get("/api/articles?sort_by=body")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles[0].article_id).toBe(10)
            expect(articles[1].article_id).toBe(9)
            expect(articles[2].article_id).toBe(4)
            expect(articles[3].article_id).toBe(13)
            expect(articles[4].article_id).toBe(3)
            expect(articles[5].article_id).toBe(7)
            expect(articles[6].article_id).toBe(1)
            expect(articles[7].article_id).toBe(11)
            expect(articles[8].article_id).toBe(12)
            expect(articles[9].article_id).toBe(6)
            expect(articles[10].article_id).toBe(2)
            expect(articles[11].article_id).toBe(5)
            expect(articles[12].article_id).toBe(8)
            // expect(articles).toBeSortedBy("body", { descending: true })
    })
    })
    test('400: Should return a bad request when given an invalud sort by query', () => {
        return request(app)
        .get("/api/articles?sort_by=somethingrandom")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid sort-by query')
        })
    })
})
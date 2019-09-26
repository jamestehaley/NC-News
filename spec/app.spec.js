process.env.NODE_ENV = "test";
const app = require("../app");
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const request = require("supertest")(app);
const connection = require("../db/connection");
chai.use(chaiSorted);

beforeEach(function() {
  this.timeout(10000);
  return connection.seed.run();
});
after(() => {
  return connection.destroy();
});
describe("non-existent paths", () => {
  it("responds 404: Page not found for paths that have not been made", () => {
    return request
      .get("/hello")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("404: Page not found!");
      });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    it("responds 200 with an array of topic objects", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an.instanceOf(Array);
          expect(topics[0]).to.be.an.instanceOf(Object);
          expect(topics[0]).to.contain.keys("slug", "description");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["patch", "put", "delete", "post"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("405: Method not allowed!");
          });
      });
      return Promise.all(promises);
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    it("responds 200 with a single user object", () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.be.an.instanceOf(Object);
          expect(user).to.contain.keys("username", "avatar_url", "name");
        });
    });
    it("responds 404: User not found for any non-existent username", () => {
      return request
        .get("/api/users/1")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("404: User not found!");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["patch", "put", "delete", "post"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api/users/butter_bridge")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("405: Method not allowed!");
          });
      });
      return Promise.all(promises);
    });
  });
});

describe.only("/api/articles", () => {
  describe("GET", () => {
    it("responds 200 with an array of article objects", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an.instanceOf(Array);
          expect(articles[0]).to.be.an.instanceOf(Object);
          expect(articles[0]).to.include.keys(
            "article_id",
            "votes",
            "created_at",
            "author",
            "title"
          );
        });
    });
    it("each article object does not contain a body", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).to.not.include.keys("body");
        });
    });
    it("each article object additionally has a comment_count", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).to.include.keys("comment_count");
        });
    });
    it("by default sorts the array by date, in descending order", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("created_at");
        });
    });
    it("sorts the array by a sort_by query value", () => {
      return request
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.descendingBy("article_id");
        });
    });
    it("orders the array by an order query value", () => {
      return request
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.ascendingBy("created_at");
        });
    });
    it("limits the array by author query value", () => {
      return request
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach(article => {
            expect(article.author).to.equal("butter_bridge");
          });
        });
    });
    it("limits the array by topic query value", () => {
      return request
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach(article => {
            expect(article.topic).to.equal("mitch");
          });
        });
    });
    it("returns 400: Invalid sort query when passed an invalid sort_by value", () => {
      return request
        .get("/api/articles?sort_by=hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("400: Invalid sort query!");
        });
    });
    it("returns 400: Invalid order query when passed an invalid order value", () => {
      return request
        .get("/api/articles?order=hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("400: Invalid sort query!");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["patch", "put", "delete", "post"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("405: Method not allowed!");
          });
      });
      return Promise.all(promises);
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    it("responds 200 with an article object", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.be.an.instanceOf(Object);
          expect(article).to.contain.keys(
            "article_id",
            "title",
            "body",
            "created_at",
            "votes",
            "author",
            "topic"
          );
        });
    });
    it("the article object additionally contains a comment count", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).to.contain.keys("comment_count");
        });
    });
    it("responds 404: Article not found when passed a valid but non existent article_id", () => {
      return request
        .get("/api/articles/12333333333")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("404: Item not found!");
        });
    });
    it("responds 400: Article type invalid when passed an invalid article_id", () => {
      return request
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("400: Item invalid!");
        });
    });
  });
  describe("PATCH", function() {
    it("responds 202 with a copy of the updated article object, which has its votes property modified", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(202)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(101);
        });
    });
    it("responds 400: Bad request when passed an inc_votes key that is not a number", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: "hello!" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("400: Votes must be a number!");
        });
    });
    it("responds 404: Article not found when passed a valid but non existent article_id", () => {
      return request
        .patch("/api/articles/12333333333")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("404: Item not found!");
        });
    });
    it("responds 400: Article type invalid when passed an invalid article_id", () => {
      return request
        .patch("/api/articles/hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("400: Item invalid!");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["put", "delete", "post"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api/articles/1")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("405: Method not allowed!");
          });
      });
      return Promise.all(promises);
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("POST", () => {
    it("responds 201 with a copy of the inserted comment", () => {
      return request
        .post("/api/articles/1/comments")
        .send({ username: "lurker", body: "nice!" })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment.body).to.equal("nice!");
          expect(comment.author).to.equal("lurker");
          expect(comment.votes).to.equal(0);
          expect(comment.article_id).to.equal(1);
          expect(comment).to.include.keys("created_at", "comment_id");
        });
    });
    it("responds 404: Item breaks foreign key constraint when the article_id is valid but non-existent", () => {
      return request
        .post("/api/articles/12333/comments")
        .send({ username: "lurker", body: "nice!" })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("404: Item breaks foreign key constraint!");
        });
    });
    it("responds 400: Item invalid when the article_id is invalid", () => {
      return request
        .post("/api/articles/hello/comments")
        .send({ username: "lurker", body: "nice!" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("400: Item invalid!");
        });
    });
    it("responds 400: Missing field when the object is lacking a username or body value", () => {
      return request
        .post("/api/articles/1/comments")
        .send({ body: "nice!" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("400: Missing field!");
        });
    });
    it("responds 422: Body breaks foreign key constraint when the username value in the body does not match an existing username", () => {
      return request
        .post("/api/articles/1/comments")
        .send({ username: "jellybeeen", body: "nice!" })
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("422: Body breaks foreign key constraint!");
        });
    });
  });
  describe("GET", () => {
    it("responds 200 with an array of the comments for the article", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.an.instanceOf(Array);
          expect(comments[0]).to.include.keys(
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          );
        });
    });
    it("by default sorts the array by 'created_at', in descending order", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("created_at");
        });
    });
    it("sorts the array by a sort_by query value", () => {
      return request
        .get("/api/articles/1/comments?sort_by=author")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("author");
        });
    });
    it("orders the array by an order query value", () => {
      return request
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.ascendingBy("created_at");
        });
    });
    it("returns 400: Invalid sort query for an invalid sort_by query value", () => {
      return request
        .get("/api/articles/1/comments?sort_by=asc")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("400: Invalid sort query!");
        });
    });
    it("returns 400: Invalid sort query for an invalid order query value", () => {
      return request
        .get("/api/articles/1/comments?order=comment_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("400: Invalid sort query!");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api/articles/1/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("405: Method not allowed!");
          });
      });
      return Promise.all(promises);
    });
  });
});

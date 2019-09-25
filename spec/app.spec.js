process.env.NODE_ENV = "test";
const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const connection = require("../db/connection");

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

describe.only("/api/articles/:article_id", () => {
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

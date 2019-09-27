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
        expect(msg).to.equal("Page not found!");
      });
  });
});
describe("/api", () => {
  describe("GET", () => {
    it("returns a JSON object of the all available endpoints", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.include.keys("/api");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["put", "delete", "post", "patch"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed!");
          });
      });
      return Promise.all(promises);
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
  describe.only("POST", () => {
    it("responds 201 with a copy of the new topic object", () => {
      return request
        .post("/api/topics")
        .send({ description: "slugs are awful", slug: "slugs" })
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic).to.eql({
            description: "slugs are awful",
            slug: "slugs"
          });
        });
    });
    it('responds 400: Missing field when not passed all required fields', () => {
      return request
        .post("/api/topics")
        .send({ description: "slugs are awful"})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Missing field!");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed!");
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
          expect(msg).to.equal("User not found!");
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
            expect(msg).to.equal("Method not allowed!");
          });
      });
      return Promise.all(promises);
    });
  });
});

describe("/api/articles", () => {
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
    it("limits the array to 10 articles by default", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(10);
        });
    });
    it("limits the array by a limit query value", () => {
      return request
        .get("/api/articles?limit=2")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(2);
        });
    });
    it("shows a page of articles dependant upon limit and p query values", () => {
      return request
        .get("/api/articles?limit=2&p=2")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(2);
          expect(articles[0].article_id).to.equal(5);
        });
    });
    it("has an article_count value of all articles matching the author and or topic queries, regardless of page limit", () => {
      return request
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { article_count } }) => {
          expect(article_count).to.equal("3");
        });
    });
    it("returns 400: Invalid sort query when passed an invalid sort_by value", () => {
      return request
        .get("/api/articles?sort_by=hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Invalid sort query!");
        });
    });
    it("returns 400: Invalid order query when passed an invalid order value", () => {
      return request
        .get("/api/articles?order=hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Invalid sort query!");
        });
    });
  });
  describe("POST", () => {
    it("responds 201 with a copy of the inserted article", () => {
      return request
        .post("/api/articles")
        .send({
          title: "The struggles of deciding article titles",
          topic: "mitch",
          author: "butter_bridge",
          body:
            "It's been 5 years since I started building this test, Mitch still hasn't responded to my calls for help"
        })
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article).to.include.keys(
            "article_id",
            "title",
            "body",
            "topic",
            "author",
            "created_at"
          );
        });
    });
    it("responds 400: Missing field when passed an object missing a required field", () => {
      return request
        .post("/api/articles")
        .send({
          title: "The struggles of deciding article titles",
          topic: "mitch",
          author: "butter_bridge"
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Missing field!");
        });
    });
    it("responds 422: Body breaks foreign key constraint when passed an object with an author that doesn't exist", () => {
      return request
        .post("/api/articles")
        .send({
          title: "The struggles of deciding article titles",
          topic: "mitch",
          author: "butterbridge",
          body:
            "It's been 5 years since I started building this test, Mitch still hasn't responded to my calls for help"
        })
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Body breaks foreign key constraint!");
        });
    });
    it("responds 422: Body breaks foreign key constraint when passed an object with an topic that doesn't exist", () => {
      return request
        .post("/api/articles")
        .send({
          title: "The struggles of deciding article titles",
          topic: "itch",
          author: "butter_bridge",
          body:
            "It's been 5 years since I started building this test, Mitch still hasn't responded to my calls for help"
        })
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Body breaks foreign key constraint!");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed!");
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
    it("responds 404: Item not found when passed a valid but non existent article_id", () => {
      return request
        .get("/api/articles/12333333333")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item not found!");
        });
    });
    it("returns 404: Item not found when passed a valid but non-existent article_id", () => {
      return request
        .get("/api/articles/1233")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item not found!");
        });
    });
    it("responds 400: Article type invalid when passed an invalid article_id", () => {
      return request
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item invalid!");
        });
    });
  });
  describe("PATCH", function() {
    it("responds 200 with a copy of the updated article object, which has its votes property modified", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
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
          expect(msg).to.equal("Votes must be a number!");
        });
    });
    it("responds 404: Article not found when passed a valid but non existent article_id", () => {
      return request
        .patch("/api/articles/12333333333")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item not found!");
        });
    });
    it("responds 400: Article type invalid when passed an invalid article_id", () => {
      return request
        .patch("/api/articles/hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item invalid!");
        });
    });
  });
  describe("DELETE", () => {
    it("responds 204 and deletes the specified article", () => {
      return request.delete("/api/articles/1").expect(204);
    });
    it("responds 404: Item not found when given a valid but non-existent article_id", () => {
      return request
        .delete("/api/articles/1000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item not found!");
        });
    });
    it("responds 400: Item invalid when given a invalid article_id", () => {
      return request
        .delete("/api/articles/hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item invalid!");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["put", "post"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api/articles/1")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed!");
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
          expect(msg).to.equal("Item breaks foreign key constraint!");
        });
    });
    it("responds 400: Item invalid when the article_id is invalid", () => {
      return request
        .post("/api/articles/hello/comments")
        .send({ username: "lurker", body: "nice!" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item invalid!");
        });
    });
    it("responds 400: Missing field when the object is lacking a username or body value", () => {
      return request
        .post("/api/articles/1/comments")
        .send({ body: "nice!" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Missing field!");
        });
    });
    it("responds 422: Body breaks foreign key constraint when the username value in the body does not match an existing username", () => {
      return request
        .post("/api/articles/1/comments")
        .send({ username: "jellybeeen", body: "nice!" })
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Body breaks foreign key constraint!");
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
    it("by default limits the responses to 10", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).to.equal(10);
        });
    });
    it("limits the responses according to a limit query", () => {
      return request
        .get("/api/articles/1/comments?limit=4")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).to.equal(4);
        });
    });
    it("provides a page of results depending on the p and limit query values", () => {
      return request
        .get("/api/articles/1/comments?limit=4&p=2")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments[0].comment_id).to.equal(10);
        });
    });
    it("additionally has a comment_count value of the total comments total regardless of limits", () => {
      return request
        .get("/api/articles/1/comments?limit=4&p=2")
        .expect(200)
        .then(({ body: { comment_count } }) => {
          expect(comment_count).to.equal("13");
        });
    });
    it("returns 400: Invalid sort query for an invalid sort_by query value", () => {
      return request
        .get("/api/articles/1/comments?sort_by=asc")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Invalid sort query!");
        });
    });
    it("returns 400: Invalid sort query for an invalid order query value", () => {
      return request
        .get("/api/articles/1/comments?order=comment_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Invalid sort query!");
        });
    });
    it("returns 404: Item not found for a valid but non existent article_id", () => {
      return request
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item not found!");
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
            expect(msg).to.equal("Method not allowed!");
          });
      });
      return Promise.all(promises);
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("PATCH", () => {
    it("responds 200 with a copy of the updated comment object, which has its votes property modified", () => {
      return request
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(17);
        });
    });
    it("responds 400: Votes must be a number when passed an invalid inc_votes value", () => {
      return request
        .patch("/api/comments/1")
        .send({ inc_votes: "null" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Votes must be a number!");
        });
    });
    it("responds 404: Item not found when the comment_id is valid but non-existent", () => {
      return request
        .patch("/api/comments/10000")
        .send({ inc_votes: 33 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item not found!");
        });
    });
  });
  describe("DELETE", () => {
    it("responds 204 and deletes the specified comment", () => {
      return request.delete("/api/comments/1").expect(204);
    });
    it("responds 404: Item not found when the comment_id is valid but non-existent", () => {
      return request
        .delete("/api/comments/10000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item not found!");
        });
    });
    it("responds 400: Item invalid when the comment_id is valid but non-existent", () => {
      return request
        .delete("/api/comments/hello")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Item invalid!");
        });
    });
  });
  describe("INVALID METHODS", () => {
    it("responds 405: Method not allowed for any unexpected method", () => {
      const invalidMethods = ["get", "put", "post"];
      const promises = invalidMethods.map(method => {
        return request[method]("/api/comments/1")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed!");
          });
      });
      return Promise.all(promises);
    });
  });
});

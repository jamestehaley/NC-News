process.env.NODE_ENV = "test";
const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const connection = require("../db/connection");

beforeEach(() => {
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
        .then(({ body }) => {
          expect(body).to.be.an.instanceOf(Array);
          expect(body[0]).to.be.an.instanceOf(Object);
          expect(body[0]).to.have.keys("slug", "description");
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

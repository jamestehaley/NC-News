const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns undefined if no list is passed", () => {
    expect(formatDates()).to.eql(undefined);
  });
  it("does not mutate the original array", () => {
    const input = [
      { created_at: 1468087638932, name: "bob" },
      { created_at: 1478813209256 },
      { created_at: 1504183900263 }
    ];
    const output = formatDates(input);
    expect(input).to.eql([
      { created_at: 1468087638932, name: "bob" },
      { created_at: 1478813209256 },
      { created_at: 1504183900263 }
    ]);
    expect(output).to.not.equal(input);
  });
  it("returns a new array for a single object with a created_at value of a matching date", () => {
    const input = [{ created_at: 0 }];
    const output = formatDates(input);
    expect(output[0].created_at).to.be.instanceOf(Date);
    expect(JSON.stringify(output[0].created_at)).to.equal(
      `"1970-01-01T00:00:00.000Z"`
    );
  });
  it("returns a new array for numerous objects with created_at values of matching dates", () => {
    const input = [{ created_at: 0 }, { created_at: 1468087638932 }];
    const output = formatDates(input);
    expect(output[0].created_at).to.be.instanceOf(Date);
    expect(output[1].created_at).to.be.instanceOf(Date);
    expect(JSON.stringify(output[0].created_at)).to.equal(
      `"1970-01-01T00:00:00.000Z"`
    );
    expect(JSON.stringify(output[1].created_at)).to.equal(
      `"2016-07-09T18:07:18.932Z"`
    );
  });
});

describe("makeRefObj", () => {
  it("returns undefined if no list is passed", () => {
    expect(makeRefObj()).to.eql(undefined);
  });
  it("does not mutate the original array", () => {
    const input = [
      { article_id: 1468087638932, title: "bob" },
      { article_id: 1478813209256, title: "name" },
      { article_id: 1504183900263, title: "title" }
    ];
    const output = makeRefObj(input);
    expect(input).to.eql([
      { article_id: 1468087638932, title: "bob" },
      { article_id: 1478813209256, title: "name" },
      { article_id: 1504183900263, title: "title" }
    ]);
    expect(output).to.not.equal(input);
  });
  it("returns a reference object with key of an object's title, with a value of the object's article_id", () => {
    const input = [{ article_id: 1, title: "article_Title" }];
    expect(makeRefObj(input)).to.eql({ article_Title: 1 });
  });
  it("returns a reference object with keys of multiple objects' titles, with values of their article_ids", () => {
    const input = [
      { article_id: 1, title: "article_Title" },
      { article_id: 2, title: "Article about frogs" }
    ];
    expect(makeRefObj(input)).to.eql({
      article_Title: 1,
      "Article about frogs": 2
    });
  });
});

describe("formatComments", () => {
  it("returns undefined if no comments or no reference object are passed", () => {
    expect(
      formatComments([
        {
          body:
            "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          belongs_to: "Living in the shadow of a great man",
          created_by: "butter_bridge",
          votes: 14,
          created_at: 1479818163389
        }
      ])
    ).to.eql(undefined);
    expect(
      formatComments({
        article_Title: 1,
        "Article about frogs": 2
      })
    ).to.eql(undefined);
  });
  it("does not mutate the original comments array or reference object", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ];
    const refObj = { "Living in the shadow of a great man": 1 };
    const output = formatComments(comments, refObj);
    expect(comments).to.eql([
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ]);
    expect(refObj).to.eql({ "Living in the shadow of a great man": 1 });
    expect(output).to.not.equal(comments);
  });
  it("returns a new array with an author key of the original 'created by' value", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const refObj = { "Living in the shadow of a great man": 1 };
    const output = formatComments(comments, refObj);
    expect(output[0].author).to.equal("butter_bridge");
    expect(output[0]).to.not.haveOwnProperty("created_by");
  });
  it("returns a new array with an article_id key instead of the original 'belongs_to' key, with the value of the corresponding article's id", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const refObj = { "Living in the shadow of a great man": 1 };
    const output = formatComments(comments, refObj);
    expect(output[0]).to.not.haveOwnProperty("belongs_to");
    expect(output[0]).to.haveOwnProperty("article_id");
    expect(output[0].article_id).to.equal(1);
  });
  it("returns the array of objects with their created_at value reformatted to javascript date objects", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const refObj = { "Living in the shadow of a great man": 1 };
    const output = formatComments(comments, refObj);
    expect(output[0].created_at).to.be.an.instanceOf(Date);
  });
});

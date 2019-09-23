const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
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

describe("formatComments", () => {});

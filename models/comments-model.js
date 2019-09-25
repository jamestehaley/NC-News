const connection = require("../db/connection");
exports.insertComment = (article_id, username, body) => {
  return connection("comments")
    .insert({ article_id, author: username, body })
    .returning("*");
};

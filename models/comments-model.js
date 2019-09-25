const connection = require("../db/connection");
exports.insertComment = (article_id, username, body) => {
  return connection("comments")
    .insert({ article_id, author: username, body })
    .returning("*");
};
exports.fetchComments = (article_id, { sort_by, order }) => {
  if (order && order !== "asc" && order !== "desc")
    return Promise.reject({ status: 400, msg: "400: Invalid sort query!" });
  else
    return connection("comments")
      .select("*")
      .where({ article_id })
      .orderBy(sort_by || "created_at", order || "desc");
};

const connection = require("../db/connection");
exports.insertComment = (article_id, username, body) => {
  return connection("comments")
    .insert({ article_id, author: username, body })
    .returning("*");
};
exports.selectComments = (article_id, { sort_by, order }) => {
  if (order && order !== "asc" && order !== "desc")
    return Promise.reject({ status: 400, msg: "Invalid sort query!" });
  else
    return connection("comments")
      .select("*")
      .where({ article_id })
      .orderBy(sort_by || "created_at", order || "desc");
};
exports.updateComment = (comment_id, votes) => {
  if (votes && isNaN(votes)) {
    return Promise.reject({
      status: 400,
      msg: "Votes must be a number!"
    });
  } else
    return connection("comments")
      .where({ comment_id })
      .modify(query => {
        if (votes) query.increment({ votes });
      })
      .returning("*")
      .then(comments => {
        if (comments.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Item not found!"
          });
        } else return comments;
      });
};
exports.delComment = comment_id => {
  return connection("comments")
    .del()
    .where({ comment_id })
    .then(deleted => {
      if (!deleted) {
        return Promise.reject({ status: 404, msg: "Item not found!" });
      }
    });
};

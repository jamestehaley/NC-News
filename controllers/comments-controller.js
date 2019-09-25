const { insertComment, fetchComments } = require("../models/comments-model");
exports.postComment = (req, res, next) => {
  const article_id = req.params.article_id;
  const { username, body } = req.body;
  insertComment(article_id, username, body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
exports.getComments = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchComments(article_id, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

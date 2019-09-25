const { insertComment } = require("../models/comments-model");
exports.postComment = (req, res, next) => {
  const article_id = req.params.article_id;
  const { username, body } = req.body;
  insertComment(article_id, username, body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

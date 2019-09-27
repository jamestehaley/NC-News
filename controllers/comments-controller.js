const {
  insertComment,
  selectComments,
  updateComment,
  delComment
} = require("../models/comments-model");
const { selectArticle } = require("../models/articles-model");
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
  const comments = selectComments(article_id, req.query);
  const article = selectArticle(article_id);
  Promise.all([article, comments])
    .then(([articleresponse, commentsresponse]) => {
      if (articleresponse.length === 0)
        next({ status: 404, msg: "Item not found!" });
      else
        res
          .status(200)
          .send({
            comments: commentsresponse,
            comment_count: articleresponse[0].comment_count
          });
    })
    .catch(next);
};
exports.patchComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  delComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

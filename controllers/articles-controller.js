const {
  selectArticle,
  updateArticle,
  selectArticles
} = require("../models/articles-model");
exports.getArticle = (req, res, next) => {
  article_id = req.params.article_id;
  selectArticle(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  article_id = req.params.article_id;
  inc_votes = req.body.inc_votes;
  updateArticle(article_id, inc_votes)
    .then(() => {
      return selectArticle(article_id);
    })
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const {
  fetchArticle,
  editArticle,
  fetchArticles
} = require("../models/articles-model");
exports.getArticle = (req, res, next) => {
  article_id = req.params.article_id;
  fetchArticle(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  article_id = req.params.article_id;
  inc_votes = req.body.inc_votes;
  editArticle(article_id, inc_votes)
    .then(() => {
      return fetchArticle(article_id);
    })
    .then(([article]) => {
      res.status(202).send({ article });
    })
    .catch(next);
};
exports.getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

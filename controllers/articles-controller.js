const {
  selectArticle,
  updateArticle,
  selectArticles,
  countArticles,
  insertArticle
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
  Promise.all([selectArticles(req.query), countArticles(req.query)])
    .then(([articles, [{ article_count }]]) => {
      res.status(200).send({ articles, article_count });
    })
    .catch(next);
};
exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

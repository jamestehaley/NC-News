const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticle
} = require("../controllers/articles-controller");
const { postComment } = require("../controllers/comments-controller");
const { handle405s } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(handle405s);
articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .all(handle405s);
module.exports = articlesRouter;

const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticle,
  getArticles
} = require("../controllers/articles-controller");
const {
  postComment,
  getComments
} = require("../controllers/comments-controller");
const { handle405s } = require("../errors");
articlesRouter
  .route("/")
  .get(getArticles)
  .all(handle405s);
articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(handle405s);
articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(handle405s);
module.exports = articlesRouter;

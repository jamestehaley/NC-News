const commentsRouter = require("express").Router();
const { handle405s } = require("../errors");
const {
  patchComment,
  deleteComment
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405s);
module.exports = commentsRouter;

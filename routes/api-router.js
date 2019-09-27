const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const { handle405s } = require("../errors");
const { getEndpoints } = require("../controllers/api-controller");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter
  .route("/")
  .get(getEndpoints)
  .all(handle405s);

module.exports = apiRouter;

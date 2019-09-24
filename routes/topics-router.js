const topicsRouter = require("express").Router();
const { handle405s } = require("../errors");
const { getTopics } = require("../controllers/topics-controller");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405s);

module.exports = topicsRouter;

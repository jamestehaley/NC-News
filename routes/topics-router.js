const topicsRouter = require("express").Router();
const { handle405s } = require("../errors");
const { getTopics, postTopic } = require("../controllers/topics-controller");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(handle405s);

module.exports = topicsRouter;

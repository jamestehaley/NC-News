const usersRouter = require("express").Router();
const { handle405s } = require("../errors");
const { getUser } = require("../controllers/users-controller");

usersRouter
  .route("/:username")
  .get(getUser)
  .patch()
  .all(handle405s);

module.exports = usersRouter;

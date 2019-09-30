const usersRouter = require("express").Router();
const { handle405s } = require("../errors");
const {
  getUser,
  postUser,
  getUsers,
  deleteUser
} = require("../controllers/users-controller");

usersRouter
  .route("/")
  .post(postUser)
  .get(getUsers)
  .all(handle405s);
usersRouter
  .route("/:username")
  .get(getUser)
  .delete(deleteUser)
  .all(handle405s);

module.exports = usersRouter;

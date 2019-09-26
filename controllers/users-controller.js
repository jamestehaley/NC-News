const { selectUser } = require("../models/users-model");

exports.getUser = (req, res, next) => {
  const username = req.params.username;
  selectUser(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

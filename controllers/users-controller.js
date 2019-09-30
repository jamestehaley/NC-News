const {
  selectUser,
  insertUser,
  selectUsers,
  delUser
} = require("../models/users-model");

exports.getUser = (req, res, next) => {
  const username = req.params.username;
  selectUser(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
exports.postUser = (req, res, next) => {
  insertUser(req.body)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
exports.getUsers = (req, res, next) => {
  selectUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};
exports.deleteUser = (req, res, next) => {
  delUser(req.params.username)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

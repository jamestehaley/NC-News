const connection = require("../db/connection");
exports.selectUser = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(user => {
      if (user[0]) return user[0];
      else return Promise.reject({ status: 404, msg: "Item not found!" });
    });
};
exports.insertUser = user => {
  return connection("users")
    .insert(user)
    .returning("*");
};
exports.selectUsers = () => {
  return connection("users").select("*");
};
exports.delUser = username => {
  return connection("users")
    .del()
    .where({ username })
    .then(count => {
      if (count === 0)
        return Promise.reject({ status: 404, msg: "Item not found!" });
    });
};

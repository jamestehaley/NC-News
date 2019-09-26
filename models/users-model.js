const connection = require("../db/connection");
exports.selectUser = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(user => {
      if (user[0]) return user[0];
      else return Promise.reject({ status: 404, msg: "User not found!" });
    });
};

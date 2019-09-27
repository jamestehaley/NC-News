const connection = require("../db/connection");
exports.selectTopics = () => {
  return connection.select("*").from("topics");
};
exports.insertTopic = topic => {
  return connection("topics")
    .insert(topic)
    .returning("*");
};

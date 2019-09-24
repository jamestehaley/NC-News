const { users, topics, articles, comments } = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(connection) {
  return connection.migrate
    .rollback()
    .then(() => {
      return connection.migrate.latest();
    })
    .then(() => {
      const topicsInsertions = connection("topics").insert(topics, "*");
      const usersInsertions = connection("users").insert(users, "*");

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(([topicRows, userRows]) => {
      return connection("articles").insert(formatDates(articles), "*");
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(comments, articleRef);
      return connection("comments").insert(formatDates(formattedComments));
    });
};

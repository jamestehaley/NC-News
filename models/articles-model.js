const connection = require("../db/connection");
exports.fetchArticle = article_id => {
  return connection
    .select("articles.*")
    .count("comments.comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id");
};

exports.editArticle = (article_id, votes) => {
  if (typeof votes !== "number") {
    return Promise.reject({ status: 400, msg: "400: Votes must be a number!" });
  } else
    return connection("articles")
      .where("article_id", article_id)
      .increment({ votes });
};

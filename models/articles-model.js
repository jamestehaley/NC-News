const connection = require("../db/connection");
exports.selectArticle = article_id => {
  return connection
    .select("articles.*")
    .count("comments.comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id");
};

exports.updateArticle = (article_id, votes) => {
  if (votes && isNaN(votes)) {
    return Promise.reject({ status: 400, msg: "400: Votes must be a number!" });
  } else
    return connection("articles")
      .where({ article_id })
      .modify(query => {
        if (votes) query.increment({ votes });
      });
};
exports.selectArticles = ({ sort_by, order, author, topic }) => {
  if (order && order !== "asc" && order !== "desc")
    return Promise.reject({ status: 400, msg: "400: Invalid sort query!" });
  else
    return connection("articles")
      .select(
        "articles.article_id",
        "articles.author",
        "articles.created_at",
        "title",
        "topic",
        "articles.votes"
      )
      .count("comments.comment_id as comment_count")
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by || "created_at", order || "desc")
      .modify(query => {
        if (author) query.where({ "articles.author": author });
        if (topic) query.where({ topic });
      });
};

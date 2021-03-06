const connection = require("../db/connection");
exports.selectArticle = article_id => {
  return connection
    .select("articles.*")
    .count("comments.comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
    .then(([article]) => {
      if (!article)
        return Promise.reject({ status: 404, msg: "Item not found!" });
      else return [article];
    });
};

exports.updateArticle = (article_id, votes) => {
  if (votes && isNaN(votes)) {
    return Promise.reject({ status: 400, msg: "Votes must be a number!" });
  } else
    return connection("articles")
      .where({ article_id })
      .modify(query => {
        if (votes) query.increment({ votes });
      });
};
exports.selectArticles = ({ sort_by, order, author, topic, limit, p }) => {
  if (order && order !== "asc" && order !== "desc")
    return Promise.reject({ status: 400, msg: "Invalid sort query!" });
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
      .limit(limit || 10)
      .offset((p || 0) * (limit || 10))
      .modify(query => {
        if (author) query.where({ "articles.author": author });
        if (topic) query.where({ topic });
      });
};
exports.countArticles = ({ author, topic }) => {
  return connection("articles")
    .count("articles.article_id as article_count")
    .modify(query => {
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ topic });
    });
};
exports.insertArticle = article => {
  return connection
    .insert(article)
    .into("articles")
    .returning("*");
};
exports.delArticle = article_id => {
  return connection("articles")
    .del()
    .where({ article_id })
    .then(count => {
      if (count === 0) {
        return Promise.reject({ status: 404, msg: "Item not found!" });
      }
    });
};

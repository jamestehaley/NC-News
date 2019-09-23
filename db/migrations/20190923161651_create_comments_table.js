exports.up = function(connection) {
  console.log("creating comments table...");
  return connection.schema.createTable("comments", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable
      .integer("article_id")
      .references(articles.article_id)
      .notNullable();
    commentTable.text("body").notNullable();
    commentTable.integer("votes").defaultTo(0);
    commentTable
      .string("author")
      .references(users.username)
      .notNullable();
    commentTable.timestamp(created_at).defaultTo(connection.fn.now());
  });
};

exports.down = function(connection) {
  return connection.schema.dropTable("comments");
};

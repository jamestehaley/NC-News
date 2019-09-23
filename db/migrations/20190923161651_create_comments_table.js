exports.up = function(connection) {
  console.log("creating comments table...");
  return connection.schema.createTable("comments", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable
      .integer("article_id")
      .references("article_id")
      .inTable("articles")
      .notNullable();
    commentTable.text("body").notNullable();
    commentTable.integer("votes").defaultTo(0);
    commentTable
      .string("author")
      .references("username")
      .inTable("users")
      .notNullable();
    commentTable.timestamp("created_at").defaultTo(connection.fn.now());
  });
};

exports.down = function(connection) {
  return connection.schema.dropTable("comments");
};

exports.up = function(connection) {
  return connection.schema.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.text("body").notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable
      .string("topic")
      .references("slug")
      .inTable("topics")
      .notNullable();
    articleTable
      .string("author")
      .references("username")
      .inTable("users")
      .notNullable();
    articleTable.timestamp("created_at").defaultTo(connection.fn.now());
  });
};

exports.down = function(connection) {
  return connection.schema.dropTable("articles");
};

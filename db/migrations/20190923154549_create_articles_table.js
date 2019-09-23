exports.up = function(connection) {
  console.log("creating articles table...");
  return connection.schema.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.text("body").notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable
      .string("topic")
      .references(topics.slug)
      .notNullable();
    articleTable
      .string("author")
      .references(users.username)
      .notNullable();
    articleTable.timestamp(created_at).defaultTo(connection.fn.now());
  });
};

exports.down = function(connection) {
  return connection.schema.dropTable("articles");
};

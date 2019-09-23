exports.up = function(connection) {
  console.log("creating topics table...");
  return connection.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(connection) {
  return connection.schema.dropTable("topics");
};

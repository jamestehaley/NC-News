exports.up = function(connection) {
  console.log("creating users table...");
  return connection.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .primary()
      .notNullable()
      .unique();
    usersTable.string("avatar_url").notNullable();
    usersTable.string("name").notNullable();
  });
};

exports.down = function(connection) {
  return connection.schema.dropTable("users");
};

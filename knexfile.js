const ENV = process.env.NODE_ENV || "development";
const { username, password } = require("./user-info");

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};
console.log(username);
const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: username,
      password: password
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username,
      password
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

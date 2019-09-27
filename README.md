# Northcoders News

An api for northcoders news

## Getting Started

These instructions will help you get the NC News server up and running on your local machine for development and testing.

### Prerequisites

To get your own copy of this project, fork this github repository in your terminal, move to an appropriate directory and type the following command into your terminal using your new repository's url

```
git clone https://github.com/exampleusername/NC-News.git
```

In order to install dependencies, ensure that you are in the root directory of this project, and type the following into the terminal:

```
npm install
```

Additionally, in order to use [postgreSQL](https://www.postgresql.org/), you must have a postgreSQL profile.

**If you are a Linux user**, you should have a user-info.js file to store your username and password. First, create the file:

```
touch user-info.js
```

**user-info.js** is declared in the .gitignore file, and therefore if you want to reupload this project to github, your information inside it will not be uploaded, input your username and password for postgreSQL into a userInfo object as follows.

```
exports.userInfo = {
  username: "your_username_here",
  password: "your_password_here"
};
```

**If you are a MacOS or OSX user**, you must edit the knexfile.js instead by removing the fields shown below. Delete:

```
const { username, password } = require("./user-info");
```

and delete the username and password variables from the customConfig object so that it looks like this:

```
const customConfig = {
  development: {
    connection: {
      database: "nc_news",
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
    }
  }
};
```

## Setting up the server

To build and seed the databases, run the following scripts:

```
npm run setup-dbs
npm run seed
```

and to run the server locally, use the command

```
npm run dev
```

If the installation was successful, the terminal should now show a console log of the following:

```
Server listening on port 9090...
```

## Testing the server

To run all automated tests on a test server, use the following command:

```
npm test
```

Then you can access the endpoints of the api using a REST client such as [insomnia](https://insomnia.rest/), endpoints take a method, a local url, and post and patch requests additionally require a body of a json object. Here is an example, which provides a json object showing all available methods:

```
GET localhost:9090/api/
```

## Built with

- [Express](https://expressjs.com/) - The framework used to build the server
- [PostgreSQL](https://www.postgresql.org) - The relational database used to store information
- [Knex](http://knexjs.org/) - A query builder used to make requests to PostgresQL

Using the following testing modules

- [Mocha](https://mochajs.org/) - Javascript test framework
- [Chai](https://www.chaijs.com/) - Assertion library, using the [Chai Sorted](https://www.chaijs.com/plugins/chai-sorted/) plugin
- [Nodemon](https://nodemon.io/) - Wrapper that restarts the server application upon changes
- [Supertest](https://www.npmjs.com/package/supertest) - A module to allow high-level abstraction for http tests

## Authors

- [Northcoders staff](https://northcoders.com) - provided the original README, data and partial file setup

* [James Haley](https://github.com/jamestehaley) - all other work

## Acknowledgements

Thankyou to the support from northcoders staff and my peers

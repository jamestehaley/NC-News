const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  handleCustomErrors,
  handleGeneric404s,
  handlePSQL404s,
  handlePSQL400s,
  handle500s,
  handlePSQL422s
} = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);
app.all("/*", handleGeneric404s);
app.use(handleCustomErrors);
app.use(handlePSQL422s);
app.use(handlePSQL404s);
app.use(handlePSQL400s);
app.use(handle500s);

module.exports = app;

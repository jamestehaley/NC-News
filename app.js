const app = require("express")();
const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);
// app.all("/*",handle404s)

module.exports = app;

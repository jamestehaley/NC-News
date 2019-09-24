const app = require("express")();
const apiRouter = require("./routes/api-router");
const { handleGeneric404s, handle500s } = require("./errors");

app.use("/api", apiRouter);
app.all("/*", handleGeneric404s);

app.use(handle500s);

module.exports = app;

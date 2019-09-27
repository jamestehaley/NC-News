const app = require("./app");
const { PORT = 9090 } = process.env;
app.listen(PORT, err => {
  console.log(`Server listening on port ${PORT}...`);
});

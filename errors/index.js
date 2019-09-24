exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
};
exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "500: Unhandled server error!" });
};

exports.handleGeneric404s = (req, res, next) => {
  res.status(404).send({ msg: "404: Page not found!" });
};
exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "405: Method not allowed!" });
};

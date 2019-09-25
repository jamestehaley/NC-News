exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
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

exports.handlePSQL422s = (err, req, res, next) => {
  if (err.code === "23503" && err.constraint === "comments_author_foreign") {
    res.status(422).send({ msg: "422: Body breaks foreign key constraint!" });
  } else next(err);
};
exports.handlePSQL404s = (err, req, res, next) => {
  const psql404s = {
    "22003": "404: Item not found!",
    "23503": "404: Item breaks foreign key constraint!"
  };
  if (Object.keys(psql404s).includes(err.code)) {
    res.status(404).send({ msg: psql404s[err.code] });
  } else next(err);
};
exports.handlePSQL400s = (err, req, res, next) => {
  const psql400s = {
    "22P02": "400: Item invalid!",
    "23502": "400: Missing field!"
  };
  if (Object.keys(psql400s).includes(err.code)) {
    res.status(400).send({ msg: psql400s[err.code] });
  } else next(err);
};

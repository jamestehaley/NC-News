const {
  selectTopics,
  insertTopic,
  delTopic
} = require('../models/topics-model');

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
exports.postTopic = (req, res, next) => {
  insertTopic(req.body)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
exports.deleteTopic = (req, res, next) => {
  delTopic(req.params.topic)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

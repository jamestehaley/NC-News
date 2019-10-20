const topicsRouter = require('express').Router();
const { handle405s } = require('../errors');
const {
  getTopics,
  postTopic,
  deleteTopic
} = require('../controllers/topics-controller');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(handle405s);
topicsRouter
  .route('/:topic')
  .delete(deleteTopic)
  .all(handle405s);
module.exports = topicsRouter;

const connection = require('../db/connection');
exports.selectTopics = () => {
  return connection.select('*').from('topics');
};
exports.insertTopic = topic => {
  return connection('topics')
    .insert(topic)
    .returning('*');
};
exports.delTopic = slug => {
  return connection('topics')
    .del()
    .where({ slug })
    .then(count => {
      if (count === 0)
        return Promise.reject({ status: 404, msg: 'Item not found!' });
    });
};

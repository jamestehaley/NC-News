exports.formatDates = list => {
  newlist = [];
  list.forEach((item, index) => {
    newlist[index] = {
      ...item
    };
    newlist[index].created_at = new Date(item.created_at);
  });
  return newlist;
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(item => {
    refObj[item.title] = item.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {};

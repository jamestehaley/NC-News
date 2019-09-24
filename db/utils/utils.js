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

exports.formatComments = (comments, refObj) => {
  const formattedComments = [];
  comments.forEach((comment, index) => {
    formattedComments[index] = { ...comment };
    formattedComments[index].author = formattedComments[index].created_by;
    delete formattedComments[index].created_by;
    formattedComments[index].article_id =
      refObj[formattedComments[index].belongs_to];
    delete formattedComments[index].belongs_to;
    formattedComments[index].created_at = new Date(comment.created_at);
  });
  return formattedComments;
};

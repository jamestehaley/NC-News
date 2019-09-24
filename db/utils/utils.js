exports.formatDates = list => {
  if (list) {
    newlist = [];
    list.forEach((item, index) => {
      newlist[index] = {
        ...item
      };
      newlist[index].created_at = new Date(item.created_at);
    });
    return newlist;
  }
};

exports.makeRefObj = list => {
  if (list) {
    const refObj = {};
    list.forEach(item => {
      refObj[item.title] = item.article_id;
    });
    return refObj;
  }
};

exports.formatComments = (comments, refObj) => {
  if (comments && refObj) {
    const formatted = [];
    comments.forEach((comment, index) => {
      formatted[index] = { ...comment };
      formatted[index].author = formatted[index].created_by;
      delete formatted[index].created_by;
      formatted[index].article_id = refObj[formatted[index].belongs_to];
      delete formatted[index].belongs_to;
      formatted[index].created_at = new Date(comment.created_at);
    });
    return formatted;
  }
};

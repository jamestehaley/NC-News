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

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};

exports.formatDates = list => {
  newlist = [];
  list.forEach((item, index) => {
    newlist[index] = {
      ...item
    };
    const date = new Date(item.created_at);
    newlist[index].created_at = `${("0000" + date.getFullYear()).slice(-4)}-${(
      "00" +
      (date.getMonth() + 1)
    ).slice(-2)}-${("00" + date.getDate()).slice(-2)} ${(
      "00" + date.getHours()
    ).slice(-2)}:${("00" + date.getMinutes()).slice(-2)}:${(
      "00" + date.getSeconds()
    ).slice(-2)}.${("000" + date.getMilliseconds()).slice(-3)}`;
    console.log(newlist[index].created_at);
  });
  return newlist;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};

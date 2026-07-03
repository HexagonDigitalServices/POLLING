
  const [comments, saves] = await Promise.all([
    Comment.aggregate([
      { $match: { poll: { $in: pollIds } } },
      { $group: { _id: "$poll", n: { $sum: 1 } } },
    ]),
    User.aggregate([
      { $match: { bookmarks: { $in: pollIds } } },
      { $unwind: "$bookmarks" },
      { $match: { bookmarks: { $in: pollIds } } },
      { $group: { _id: "$bookmarks", n: { $sum: 1 } } },
    ]),
  ]);
  const commentMap = {};
  const saveMap = {};
  comments.forEach((c) => (commentMap[String(c._id)] = c.n));
  saves.forEach((s) => (saveMap[String(s._id)] = s.n));
  
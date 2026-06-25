const [polls, voted, followers, me] = await Promise.all([
      Poll.find({ creator: user._id })
        .populate("creator", "name username avatar")
        .sort("-createdAt"),
      Poll.countDocuments({ "votes.user": user._id }),
      User.countDocuments({ following: user._id }),
      User.findById(req.userId).select("bookmarks following"),
    ]);
    const set = new Set((me?.bookmarks || []).map(String));
    const isFollowing = (me?.following || []).some(
      (id) => String(id) === String(user._id),
    );
    const shaped = await withCounts(
      polls.map((p) => shapePoll(p, req.userId, set)),
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
      },
      isFollowing,
      isMe: String(user._id) === String(req.userId),
      stats: {
        created: polls.length,
        voted,
        followers,
        following: user.following.length,
      },
      polls: shaped,
    });
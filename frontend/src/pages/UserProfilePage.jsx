const { username } = useParams();
  const { refresh } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [showList, setShowList] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${username}`);
      setData(res.data);
      setMissing(false);
    } catch {
      setMissing(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [username]);

  const vote = async (id, value) => {
    await api.post(`/polls/${id}/vote`, { value });
    await load();
    refresh();
  };
  const unvote = async (id) => {
    await api.delete(`/polls/${id}/vote`);
    await load();
    refresh();
  };
  const bookmark = async (id) => {
    await api.post(`/polls/${id}/bookmark`);
    setData((d) => ({
      ...d,
      polls: d.polls.map((p) =>
        p._id === id
          ? {
              ...p,
              isBookmarked: !p.isBookmarked,
              saves: (p.saves || 0) + (p.isBookmarked ? -1 : 1),
            }
          : p,
      ),
    }));
    refresh();
  };
  const follow = async () => {
    const { data: res } = await api.post(`/users/${username}/follow`);
    setData((d) => ({
      ...d,
      isFollowing: res.following,
      stats: { ...d.stats, followers: res.followers },
    }));
    toast(res.following ? `Following ${data.user.name}` : "Unfollowed");
  };

  if (loading) return <PollSkeleton />;
  if (missing || !data)
    return (
      <div className={s.errorContainer}>
        User not found.
      </div>
    );

  const { user, stats, polls, isFollowing, isMe } = data;
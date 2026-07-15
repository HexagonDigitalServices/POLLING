function StatCard({ Icon, label, value, color }) {
  return (
    <div className={s.statCard}>
      <span className={`${s.statIcon} ${color}`}>
        <Icon size={15} />
      </span>
      <p className={s.statValue}>{value}</p>
      <p className={s.statLabel}>{label}</p>
    </div>
  );
}

  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/polls/${id}/analytics`)
      .then(({ data }) => setData(data))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load analytics"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PollSkeleton />;
  if (error || !data)
    return (
      <div className={s.errorContainer}>
        {error || "Not found."}
      </div>
    );

  const { poll, comments } = data;
  const engagement = poll.views
    ? Math.round((poll.totalVotes / poll.views) * 100)
    : 0;
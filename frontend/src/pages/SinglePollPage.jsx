
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const load = async (skipView = false) => {
    try {
      const { data } = await api.get(
        `/polls/${id}${skipView ? "?noview=true" : ""}`,
      );
      setPoll(data);
    } catch {
      setMissing(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load(false);
  }, [id]);

  const vote = async (_id, value) => {
    await api.post(`/polls/${id}/vote`, { value });
    await load(true);
    refresh();
  };
  const unvote = async () => {
    await api.delete(`/polls/${id}/vote`);
    await load(true);
    refresh();
  };
  const bookmark = async () => {
    await api.post(`/polls/${id}/bookmark`);
    setPoll((p) => ({
      ...p,
      isBookmarked: !p.isBookmarked,
      saves: (p.saves || 0) + (p.isBookmarked ? -1 : 1),
    }));
    refresh();
  };
  const edit = async (_id, payload) => {
    await api.patch(`/polls/${id}`, payload);
    await load(true);
  };
  const close = async () => {
    const { data } = await api.patch(`/polls/${id}/close`);
    setPoll((p) => ({ ...p, closed: data.closed }));
  };
  const remove = async () => {
    await api.delete(`/polls/${id}`);
    navigate("/dashboard");
  };

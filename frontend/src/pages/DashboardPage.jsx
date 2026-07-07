  const { user } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState("all");
  const [type, setType] = useState("all");
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();

  const qs = new URLSearchParams();
  if (type !== "all") qs.set("type", type);
  if (feed === "following") qs.set("feed", "following");
  const path = `/polls${qs.toString() ? `?${qs}` : ""}`;
  const { polls, loading, vote, unvote, bookmark } = usePolls(path);

  const shown = polls
    .filter((p) => p.question.toLowerCase().includes(q))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const COLORS = [
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
];

function Trending() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api
      .get("/polls/trending")
      .then(({ data }) => setItems(data))
      .catch(() => {});
  }, []);
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className={s.trendingCard}>
      <h3 className={s.trendingHeading}>
        <TrendingUp size={12} className={s.trendingIcon} /> Poll types
      </h3>
      <ul className={s.trendingList}>
        {items.map((it, idx) => {
          const m = TYPE_META[it.type];
          if (!m) return null;
          const { Icon } = m;
          const pct = Math.round((it.count / max) * 100);
          return (
            <li key={it.type}>
              <div className={s.trendingItemRow}>
                <span className={s.trendingItemLabel}>
                  <Icon size={12} className={s.trendingItemIcon} /> {m.label}
                </span>
                <span className={s.trendingItemCount}>{it.count}</span>
              </div>
              <div className={s.trendingBarTrack}>
                <div
                  className={`${s.trendingBarFillBase} ${COLORS[idx % COLORS.length]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
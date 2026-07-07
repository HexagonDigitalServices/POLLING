import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api.js";
import useClickOutside from "../hooks/useClickOutside.js";
import { notificationStyles as s } from "../assets/dummyStyles";

const verb = (t) =>
  t === "vote" ? "voted on your poll" : "commented on your poll";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const load = () =>
    api
      .get("/notifications")
      .then(({ data }) => {
        setItems(data.items);
        setUnread(data.unread);
      })
      .catch(() => {});

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && unread) {
      try {
        await api.patch("/notifications/read");
        setUnread(0);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className={s.container} ref={ref}>
      <button onClick={toggle} className={s.bellButton}>
        <Bell size={16} />
        {unread > 0 && <span className={s.badgeDot} />}
      </button>

      {open && (
        <div className={s.dropdown}>
          <div className={s.header}>
            <p className={s.headerText}>Notifications</p>
          </div>
          {items.length === 0 ? (
            <p className={s.emptyText}>No notifications yet.</p>
          ) : (
            items.map((n) => (
              <Link
                key={n._id}
                to={n.poll ? `/poll/${n.poll._id}` : "/dashboard"}
                onClick={() => setOpen(false)}
                className={`${s.notificationLink} ${
                  !n.read ? s.notificationUnread : ""
                }`}
              >
                <span className={s.notificationText}>
                  <span className={s.actorName}>
                    @{n.actor?.username}
                  </span>{" "}
                  {verb(n.type)}
                  {n.poll?.question ? (
                    <span className={s.pollPreview}>
                      {" "}
                      · "{n.poll.question.slice(0, 40)}"
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
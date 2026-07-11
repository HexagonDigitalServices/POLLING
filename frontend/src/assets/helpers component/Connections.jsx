import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api.js";
import { Avatar } from "./UIElements.jsx";
import { connectionsStyles as s } from "../assets/dummyStyles";

export default function Connections({ username, initialTab = "followers" }) {
  const [tab, setTab] = useState(initialTab);
  const [data, setData] = useState({ followers: [], following: [] });

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!username) return;
    api
      .get(`/users/${username}/connections`)
      .then(({ data }) => setData(data))
      .catch(() => {});
  }, [username]);

  const list = tab === "followers" ? data.followers : data.following;
  const TABS = [
    ["followers", "Followers", data.followers.length],
    ["following", "Following", data.following.length],
  ];

  return (
    <div className={s.container}>
      <div className={s.tabContainer}>
        {TABS.map(([k, label, n]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`${s.tabButtonBase} ${
              tab === k ? s.tabButtonActive : s.tabButtonInactive
            }`}
          >
            {label} {n}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className={s.emptyText}>
          {tab === "followers"
            ? "No followers yet."
            : "You're not following anyone yet."}
        </p>
      ) : (
        <div className={s.userList}>
          {list.map((u) => (
            <Link
              key={u._id}
              to={`/user/${u.username}`}
              className={s.userLink}
            >
              <Avatar user={u} className={s.userAvatar} />
              <div className={s.userInfo}>
                <p className={s.userName}>{u.name}</p>
                <p className={s.userUsername}>@{u.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
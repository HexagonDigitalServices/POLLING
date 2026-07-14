import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserPlus, UserCheck } from "lucide-react";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";
import { Avatar, Button, PollSkeleton } from "../components/UIElements.jsx";
import PollCard from "../components/PollCard.jsx";
import Connections from "../components/Connections.jsx";
import { userProfileStyles as s } from "../assets/dummyStyles";

export default function UserProfilePage() {
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
    load();
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
    return <div className={s.errorContainer}>User not found.</div>;

  const { user, stats, polls, isFollowing, isMe } = data;

  return (
    <div>
      {/* Profile card */}
      <div className={s.profileCard}>
        <div className={s.bannerContainer}>
          <div className={s.bannerGlow} />
        </div>

        <div className={s.profileBody}>
          <div className={s.avatarRow}>
            <Avatar user={user} className={s.avatarClass} />
            {!isMe && (
              <Button
                onClick={follow}
                variant={isFollowing ? "ghost" : "primary"}
                className={s.followButton}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={14} /> Following
                  </>
                ) : (
                  <>
                    <UserPlus size={14} /> Follow
                  </>
                )}
              </Button>
            )}
          </div>

          <div className={s.userInfo}>
            <h1 className={s.userName}>{user.name}</h1>
            <p className={s.userUsername}>@{user.username}</p>
            {user.bio && <p className={s.userBio}>{user.bio}</p>}
          </div>

          <div className={s.statsRow}>
            <div>
              <span className={s.statNumber}>{stats.created}</span>{" "}
              <span className={s.statLabel}>Polls</span>
            </div>
            {[
              ["followers", "Followers", stats.followers],
              ["following", "Following", stats.following],
            ].map(([key, label, n]) => (
              <button
                key={key}
                onClick={() => setShowList(showList === key ? null : key)}
                className={s.statClickable}
              >
                <span className={s.statNumber}>{n}</span>{" "}
                <span
                  className={`${s.statLabel} ${showList === key ? s.statLabelHighlight : ""}`}
                >
                  {label}
                </span>
              </button>
            ))}
            <div>
              <span className={s.statNumber}>{stats.voted}</span>{" "}
              <span className={s.statLabel}>Voted</span>
            </div>
          </div>

          {showList && (
            <div className={s.connectionsWrapper}>
              <Connections username={username} initialTab={showList} />
            </div>
          )}
        </div>
      </div>

      {/* Polls */}
      <p className={s.pollsHeading}>Polls by {user.name}</p>
      {polls.length === 0 ? (
        <p className={s.emptyPolls}>No polls yet.</p>
      ) : (
        polls.map((p) => (
          <PollCard
            key={p._id}
            poll={p}
            vote={vote}
            unvote={unvote}
            bookmark={bookmark}
          />
        ))
      )}
    </div>
  );
}

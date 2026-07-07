import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowBigUp,
  Bookmark,
  MessageCircle,
  BarChart2,
  Lock,
  Pencil,
  RotateCcw,
} from "lucide-react";
import PollVote from "./PollVote.jsx";
import Comments from "./Comments.jsx";
import { Avatar, Button, inputCls } from "./UIElements.jsx";
import { pollCardStyles as s } from "../assets/dummyStyles";

const CATEGORIES = [
  "General",
  "Tech",
  "Food",
  "Sports",
  "Entertainment",
  "Gaming",
  "Music",
  "Travel",
  "Education",
  "Lifestyle",
  "Other",
];

const ago = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  for (const [n, sec] of [
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ]) {
    const v = Math.floor(s / sec);
    if (v >= 1) return `${v}${n} ago`;
  }
  return "just now";
};

// Deterministic category color from category string
const ACCENTS = [
  {
    bar: "bg-emerald-500",
    tag: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  { bar: "bg-sky-500", tag: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  {
    bar: "bg-violet-500",
    tag: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  {
    bar: "bg-amber-500",
    tag: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    bar: "bg-rose-500",
    tag: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  {
    bar: "bg-teal-500",
    tag: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
];
const accentOf = (s = "") =>
  ACCENTS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % ACCENTS.length];

export default function PollCard({
  poll,
  vote,
  unvote,
  bookmark,
  edit,
  close,
  remove,
  owner,
}) {
  const voted = poll.myVote !== null && poll.myVote !== undefined;
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [eq, setEq] = useState("");
  const [ecat, setEcat] = useState("");
  const u = poll.creator || {};
  const a = accentOf(poll.category);

  const startEdit = () => {
    setEq(poll.question);
    setEcat(poll.category);
    setEditing(true);
  };
  const saveEdit = async () => {
    await edit(poll._id, { question: eq, category: ecat });
    setEditing(false);
  };

  return (
    <div className={s.card}>
      {/* Category accent stripe */}
      <div className={`h-px ${a.bar}`} />

      <div className="p-4">
        {/* Header row */}
        <div className={s.header}>
          <Link to={`/user/${u.username}`}>
            <Avatar user={u} className={s.avatar} />
          </Link>
          <div className={s.userInfo}>
            <div className={s.userInfoInner}>
              <Link
                to={`/user/${u.username}`}
                className={s.userNameLink}
              >
                {u.name}
              </Link>
              <span className={s.dot}>·</span>
              <span className={s.username}>@{u.username}</span>
              <span className={s.dot}>·</span>
              <span className={s.timestamp}>{ago(poll.createdAt)}</span>
            </div>
          </div>
          {poll.closed && (
            <span className={s.closedBadge}>
              <Lock size={9} /> Closed
            </span>
          )}
          <span className={`${s.categoryTagBase} ${a.tag}`}>
            {poll.category}
          </span>
        </div>

        {/* Owner controls */}
        {owner && !editing && (
          <div className={s.ownerControls}>
            {edit && (
              <button
                onClick={startEdit}
                className={s.ownerButton}
              >
                <Pencil size={11} /> Edit
              </button>
            )}
            <Link
              to={`/poll/${poll._id}/analytics`}
              className={s.ownerAnalytics}
            >
              <BarChart2 size={11} /> Analytics
            </Link>
            <button
              onClick={() => close(poll._id)}
              className={s.ownerButton}
            >
              {poll.closed ? (
                <>
                  <RotateCcw size={11} /> Reopen
                </>
              ) : (
                <>
                  <Lock size={11} /> Close
                </>
              )}
            </button>
            <button
              onClick={() => remove(poll._id)}
              className={s.ownerDelete}
            >
              Delete
            </button>
          </div>
        )}

        {/* Edit mode */}
        {editing ? (
          <div className="mb-3 space-y-2">
            <textarea
              value={eq}
              onChange={(e) => setEq(e.target.value)}
              className={`${inputCls} ${s.editTextarea}`}
            />
            <select
              value={ecat}
              onChange={(e) => setEcat(e.target.value)}
              className={inputCls}
            >
              {CATEGORIES.map((x) => (
                <option key={x} value={x} className="bg-zinc-900">
                  {x}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={saveEdit} className={s.editButton}>
                Save
              </button>
              <button
                variant="ghost"
                onClick={() => setEditing(false)}
                className={s.editButton}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <h2 className={s.question}>{poll.question}</h2>
        )}

        {/* Voting controls */}
        <PollVote
          poll={poll}
          onVote={(v) => vote(poll._id, v)}
          onUnvote={!poll.closed && unvote ? () => unvote(poll._id) : undefined}
        />

        {/* Footer actions */}
        <div className={s.footer}>
          <span className={s.totalVotes}>
            <ArrowBigUp size={14} /> {poll.totalVotes}
          </span>

          <button
            title="Comments"
            onClick={() => setShowComments(!showComments)}
            className={`${s.action} ${showComments ? s.actionActive : ""}`}
          >
            <MessageCircle size={14} /> {poll.comments ?? 0}
          </button>

          <button
            title={poll.isBookmarked ? "Saved" : "Save"}
            onClick={() => bookmark(poll._id)}
            className={`${s.action} ${poll.isBookmarked ? s.actionActive : ""}`}
          >
            <Bookmark
              size={14}
              className={poll.isBookmarked ? s.saveIconFill : ""}
            />{" "}
            {poll.saves ?? 0}
          </button>
        </div>

        {showComments && <Comments pollId={poll._id} />}
      </div>
    </div>
  );
}
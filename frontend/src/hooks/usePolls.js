import { useState, useEffect, useCallback } from "react";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";

// Loads polls from `path` and exposes vote/bookmark/edit/close/delete actions.
// Reused by Dashboard, My Polls, Voted Polls and Bookmarks.
export default function usePolls(path) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refresh } = useAuth();
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(path);
      setPolls(data);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  const replace = (p) =>
    setPolls((arr) => arr.map((x) => (x._id === p._id ? p : x)));

  const vote = async (id, value) => {
    const wasVoted = polls.find((p) => p._id === id)?.myVote != null;
    await api.post(`/polls/${id}/vote`, { value });
    const { data } = await api.get(`/polls/${id}?noview=true`); // refetch to get results
    replace(data);
    toast(wasVoted ? "Vote changed" : "Vote recorded");
    refresh();
  };

  const unvote = async (id) => {
    try {
      await api.delete(`/polls/${id}/vote`);
      const { data } = await api.get(`/polls/${id}?noview=true`);
      replace(data);
      toast("Vote removed");
      refresh();
    } catch (err) {
      toast(
        err.response?.data?.message ||
        "Couldn't remove vote — is the server running?",
        "error",
      );
    }
  };

  const bookmark = async (id) => {
    const { data } = await api.post(`/polls/${id}/bookmark`);
    setPolls((arr) =>
      arr.map((x) =>
        x._id === id
          ? {
            ...x,
            isBookmarked: !x.isBookmarked,
            saves: (x.saves || 0) + (x.isBookmarked ? -1 : 1),
          }
          : x,
      ),
    );
    toast(data.bookmarked ? "Saved" : "Removed from saved");
    refresh();
  };

  const edit = async (id, payload) => {
    await api.patch(`/polls/${id}`, payload);
    const { data } = await api.get(`/polls/${id}?noview=true`);
    replace(data);
    toast("Poll updated");
  };

  const close = async (id) => {
    const { data } = await api.patch(`/polls/${id}/close`);
    setPolls((arr) =>
      arr.map((x) => (x._id === id ? { ...x, closed: data.closed } : x)),
    );
    toast(data.closed ? "Poll closed" : "Poll re-opened");
  };

  const remove = async (id) => {
    await api.delete(`/polls/${id}`);
    setPolls((arr) => arr.filter((x) => x._id !== id));
    toast("Poll deleted");
    refresh();
  };

  return { polls, loading, load, vote, unvote, bookmark, edit, close, remove };
}

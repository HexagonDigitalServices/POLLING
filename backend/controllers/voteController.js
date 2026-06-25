// PATCH /api/polls/:id  -> owner edits question / category
export const updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    if (!ownerGuard(poll, req.userId)) return res.status(403).json({ message: "Not your poll" });
    const { question, category } = req.body;
    if (question !== undefined && question.trim()) poll.question = question.trim();
    if (category !== undefined) poll.category = category;
    await poll.save();
    res.json({ message: "Poll updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
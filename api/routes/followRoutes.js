import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/follow", async (req, res) => {
  const { userId, targetId } = req.body;
  if (userId === targetId)
    return res.status(400).json({ error: "Cannot follow yourself" });
  try {
    const user = await User.findOne({ id: userId });
    const target = await User.findOne({ id: targetId });
    if (!user || !target)
      return res.status(404).json({ error: "User not found" });
    if (!user.following.includes(targetId)) user.following.push(targetId);
    if (!target.followers.includes(userId)) target.followers.push(userId);
    await user.save();
    await target.save();
    res.json({ message: `Now following ${target.name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/unfollow", async (req, res) => {
  const { userId, targetId } = req.body;
  try {
    const user = await User.findOne({ id: userId });
    const target = await User.findOne({ id: targetId });
    if (!user || !target)
      return res.status(404).json({ error: "User not found" });
    user.following = user.following.filter((id) => id !== targetId);
    target.followers = target.followers.filter((id) => id !== userId);
    await user.save();
    await target.save();
    res.json({ message: `Unfollowed ${target.name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/followers/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    const followers = await User.find(
      { id: { $in: user.followers } },
      "id name email"
    );
    res.json(followers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/following/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    const following = await User.find(
      { id: { $in: user.following } },
      "id name email"
    );
    res.json(following);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

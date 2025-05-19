import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id, name, email } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { id, name, email },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Delete user
// router.delete('/:id', async (req, res) => {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: 'User deleted' });
// });

export default router;

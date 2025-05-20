import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update a user by email (upsert)
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

// Get a user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a user's progress by id
router.get("/:id/progress", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }, "progress");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.progress || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a user's progress for a lesson
router.post("/:id/progress", async (req, res) => {
  try {
    const { lessonId, completed, quizzes, lastAccessed } = req.body;
    if (!lessonId) {
      return res.status(400).json({ error: "lessonId is required" });
    }
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    let progress = user.progress || [];
    const idx = progress.findIndex((p) => p.lessonId === lessonId);
    if (idx > -1) {
      // Update existing progress entry
      progress[idx] = {
        ...progress[idx],
        lessonId,
        completed: completed ?? progress[idx].completed,
        quizzes: quizzes ?? progress[idx].quizzes,
        lastAccessed: lastAccessed ?? progress[idx].lastAccessed,
      };
    } else {
      // Add new progress entry
      progress.push({
        lessonId,
        completed: !!completed,
        quizzes: quizzes || [],
        lastAccessed: lastAccessed || new Date(),
      });
    }
    user.progress = progress;
    await user.save();
    res.json({ message: "Progress updated", progress: user.progress });
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

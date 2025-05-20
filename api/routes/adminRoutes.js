import express from "express";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import Scam from "../models/Scam.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/role/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ role: user.role });
});

router.get("/users", isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/promote/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { role: "admin" },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: `${user.name} promoted to admin.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/demote/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { role: "user" },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: `${user.name} demoted to user.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/stats", isAdmin, async (req, res) => {
  const totalLessons = await Lesson.countDocuments();
  const totalQuizzes = await Lesson.aggregate([
    { $unwind: "$quiz" },
    { $count: "total" },
  ]);
  res.json({ totalLessons, totalQuizzes: totalQuizzes[0]?.total || 0 });
});

router.post("/lessons", isAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/lessons/:lessonId/quiz", isAdmin, async (req, res) => {
  const { topic, questions } = req.body;
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    lesson.quiz.push({ topic, questions });
    await lesson.save();

    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/lessons/:lessonId/quiz/:quizId", isAdmin, async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  const quiz = lesson.quiz.id(req.params.quizId);
  Object.assign(quiz, req.body);
  await lesson.save();
  res.json(quiz);
});

router.post(
  "/lessons/:lessonId/quiz/:quizId/question",
  isAdmin,
  async (req, res) => {
    const { question, options, answer, explanation } = req.body;
    try {
      const lesson = await Lesson.findById(req.params.lessonId);
      if (!lesson) return res.status(404).json({ error: "Lesson not found" });

      const quiz = lesson.quiz.id(req.params.quizId);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });

      quiz.questions.push({ question, options, answer, explanation });
      await lesson.save();

      res.status(201).json(quiz);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.delete("/lessons/:lessonId", isAdmin, async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.lessonId);
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/lessons/:lessonId/quiz/:quizId", isAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const quiz = lesson.quiz.id(req.params.quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    quiz.remove();
    await lesson.save();

    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete(
  "/lessons/:lessonId/quiz/:quizId/question/:questionId",
  isAdmin,
  async (req, res) => {
    try {
      const lesson = await Lesson.findById(req.params.lessonId);
      if (!lesson) return res.status(404).json({ error: "Lesson not found" });

      const quiz = lesson.quiz.id(req.params.quizId);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });

      const question = quiz.questions.id(req.params.questionId);
      if (!question)
        return res.status(404).json({ error: "Question not found" });

      question.remove();
      await lesson.save();

      res.json({ message: "Question deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get("/scams", isAdmin, async (req, res) => {
  const scams = await Scam.find().populate("submittedBy");
  res.json(scams);
});

router.delete("/scams/:id", isAdmin, async (req, res) => {
  await Scam.findByIdAndDelete(req.params.id);
  res.json({ message: "Scam removed" });
});

export default router;

import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    lessonId: String,
    completed: { type: Boolean, default: false },
    quizzes: [
      {
        quizId: String,
        completed: { type: Boolean, default: false },
        score: Number,
        lastQuestion: Number,
      },
    ],
    lastAccessed: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  followers: [{ type: String }],
  following: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  progress: [progressSchema],
});

const User = mongoose.model("User", userSchema);

export default User;

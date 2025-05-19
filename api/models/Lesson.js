import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id: String,
  question: String,
  options: [String],
  answer: String,
  explanation: String,
});

const quizSchema = new mongoose.Schema({
  topic: String,
  questions: [questionSchema],
});

const lessonSchema = new mongoose.Schema({
  topic: String,
  content: String,
  quiz: [quizSchema],
});

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;

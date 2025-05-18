
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    id: String,
    topic: String,
    question: String,
    options: [String],
    answer: String,
    explanation: String,
});

const lessonSchema = new mongoose.Schema({
  topic: String,
  content: String,
  quiz: [quizSchema],
});

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;

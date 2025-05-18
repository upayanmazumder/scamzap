"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import API from "../../../utils/api";

const initialQuiz = {
  topic: "",
  question: "",
  options: ["", "", "", ""],
  answer: "",
  explanation: "",
};

const initialLessonState = {
  topic: "",
  content: "",
  quiz: [initialQuiz],
};

const LessonManager = () => {
  const { data: session } = useSession();
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState(initialLessonState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const adminId = session?.user?.sub;

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/lessons`);
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuizChange = (index, field, value) => {
    setNewLesson((prev) => {
      const updated = [...prev.quiz];
      updated[index][field] = value;
      return { ...prev, quiz: updated };
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setNewLesson((prev) => {
      const updated = [...prev.quiz];
      updated[qIndex].options[optIndex] = value;
      return { ...prev, quiz: updated };
    });
  };

  const addQuiz = () => {
    setNewLesson((prev) => ({
      ...prev,
      quiz: [...prev.quiz, initialQuiz],
    }));
  };

  const deleteQuiz = (index) => {
    setNewLesson((prev) => {
      const updated = [...prev.quiz];
      updated.splice(index, 1);
      return { ...prev, quiz: updated };
    });
  };

  const validateLesson = () => {
    const errs = {};
    if (!newLesson.topic.trim()) errs.topic = "Topic is required.";
    if (!newLesson.content.trim()) errs.content = "Content is required.";

    const quizErrors = newLesson.quiz.map((q, index) => {
      const qErr = {};
      if (!q.topic.trim()) qErr.topic = "Topic required";
      if (!q.question.trim()) qErr.question = "Question required";
      if (q.options.some((opt) => !opt.trim()))
        qErr.options = "All 4 options are required";
      if (!q.answer.trim()) qErr.answer = "Answer required";
      if (!q.explanation.trim()) qErr.explanation = "Explanation required";
      return Object.keys(qErr).length > 0 ? qErr : null;
    });

    if (quizErrors.some((q) => q !== null)) errs.quiz = quizErrors;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitLesson = async () => {
    if (!adminId) return;
    if (!validateLesson()) {
      setMessage("❌ Please fix the errors before submitting.");
      return;
    }

    const lessonToSend = {
      ...newLesson,
      quiz: newLesson.quiz.map((q, i) => ({ ...q, id: i + 1 })),
    };

    setMessage("Submitting...");
    try {
      const res = await fetch(`${API}/admin/lessons?userId=${adminId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonToSend),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage("✅ Lesson added successfully!");
      setNewLesson(initialLessonState);
      setErrors({});
      fetchLessons();
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <motion.h2
        className="text-4xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Lesson Manager
      </motion.h2>

      {/* Add Lesson Form */}
      <motion.div
        className="p-6 border rounded-xl shadow-xl bg-white dark:bg-gray-900 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-semibold">Add New Lesson</h3>

        <div>
          <input
            name="topic"
            value={newLesson.topic}
            onChange={handleLessonChange}
            placeholder="Lesson Topic"
            className="w-full p-3 border rounded-lg"
          />
          {errors.topic && (
            <p className="text-red-500 text-sm">{errors.topic}</p>
          )}
        </div>

        <div>
          <textarea
            name="content"
            value={newLesson.content}
            onChange={handleLessonChange}
            placeholder="Lesson Content"
            className="w-full p-3 border rounded-lg"
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content}</p>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Quiz Questions</h4>

          {newLesson.quiz.map((q, index) => (
            <motion.div
              key={index}
              className="relative bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-3"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {newLesson.quiz.length > 1 && (
                <button
                  onClick={() => deleteQuiz(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                >
                  ✖ Remove
                </button>
              )}
              <div className="font-medium text-gray-700 dark:text-gray-300">
                Quiz #{index + 1}
              </div>

              <input
                value={q.topic}
                onChange={(e) =>
                  handleQuizChange(index, "topic", e.target.value)
                }
                placeholder="Quiz Topic"
                className="w-full p-2 border rounded"
              />
              {errors.quiz?.[index]?.topic && (
                <p className="text-red-500 text-sm">
                  {errors.quiz[index].topic}
                </p>
              )}

              <input
                value={q.question}
                onChange={(e) =>
                  handleQuizChange(index, "question", e.target.value)
                }
                placeholder="Question"
                className="w-full p-2 border rounded"
              />
              {errors.quiz?.[index]?.question && (
                <p className="text-red-500 text-sm">
                  {errors.quiz[index].question}
                </p>
              )}

              {q.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(index, optIndex, e.target.value)
                  }
                  placeholder={`Option ${optIndex + 1}`}
                  className="w-full p-2 border rounded"
                />
              ))}
              {errors.quiz?.[index]?.options && (
                <p className="text-red-500 text-sm">
                  {errors.quiz[index].options}
                </p>
              )}

              <input
                value={q.answer}
                onChange={(e) =>
                  handleQuizChange(index, "answer", e.target.value)
                }
                placeholder="Correct Answer"
                className="w-full p-2 border rounded"
              />
              {errors.quiz?.[index]?.answer && (
                <p className="text-red-500 text-sm">
                  {errors.quiz[index].answer}
                </p>
              )}

              <textarea
                value={q.explanation}
                onChange={(e) =>
                  handleQuizChange(index, "explanation", e.target.value)
                }
                placeholder="Explanation"
                className="w-full p-2 border rounded"
              />
              {errors.quiz?.[index]?.explanation && (
                <p className="text-red-500 text-sm">
                  {errors.quiz[index].explanation}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={addQuiz}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add Quiz
          </button>
          <button
            onClick={submitLesson}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ✅ Submit Lesson
          </button>
        </div>
        {message && (
          <p className="text-sm mt-2 text-blue-600 dark:text-blue-400">
            {message}
          </p>
        )}
      </motion.div>

      {/* Display Lessons */}
      <div>
        <h3 className="text-2xl font-semibold text-center mb-4">All Lessons</h3>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <motion.div
                key={lesson._id}
                className="border rounded-xl p-4 shadow bg-white dark:bg-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h4 className="text-xl font-bold">{lesson.topic}</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {lesson.content}
                </p>
                {lesson.quiz.length > 0 && (
                  <ul className="list-disc pl-6 space-y-4">
                    {lesson.quiz.map((q, idx) => (
                      <li key={idx} className="space-y-1">
                        <div>
                          <strong>{q.topic}</strong>: {q.question}
                        </div>
                        <ul className="list-decimal pl-5 text-gray-600">
                          {q.options.map((opt, optIdx) => (
                            <li key={optIdx}>{opt}</li>
                          ))}
                        </ul>
                        <div className="text-sm text-gray-800">
                          <strong>Answer:</strong> {q.answer}
                        </div>
                        <div className="text-sm text-green-600 italic">
                          Explanation: {q.explanation}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonManager;

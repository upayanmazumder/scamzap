"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import API from "../../../utils/api";

import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";

const createEmptyQuiz = () => ({
  id: `${Date.now()}-${Math.random()}`, // unique id per quiz
  topic: "",
  question: "",
  options: ["", "", "", ""],
  answer: "",
  explanation: "",
});

const initialLessonState = {
  topic: "",
  content: "",
  quiz: [createEmptyQuiz()],
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

  const handleQuizChange = (quizId, field, value) => {
    setNewLesson((prev) => {
      const updatedQuiz = prev.quiz.map((q) =>
        q.id === quizId ? { ...q, [field]: value } : q
      );
      return { ...prev, quiz: updatedQuiz };
    });
  };

  const handleOptionChange = (quizId, optionIndex, value) => {
    setNewLesson((prev) => {
      const updatedQuiz = prev.quiz.map((q) => {
        if (q.id === quizId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      });
      return { ...prev, quiz: updatedQuiz };
    });
  };

  const addQuiz = () => {
    setNewLesson((prev) => ({
      ...prev,
      quiz: [...prev.quiz, createEmptyQuiz()],
    }));
  };

  const deleteQuiz = (quizId) => {
    setNewLesson((prev) => {
      const filteredQuiz = prev.quiz.filter((q) => q.id !== quizId);
      return {
        ...prev,
        quiz: filteredQuiz.length > 0 ? filteredQuiz : [createEmptyQuiz()],
      };
    });
  };

  const validateLesson = () => {
    const errs = {};
    if (!newLesson.topic.trim()) errs.topic = "Topic is required.";
    if (!newLesson.content.trim()) errs.content = "Content is required.";

    const quizErrors = newLesson.quiz.map((q) => {
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
    if (!adminId) {
      setMessage("❌ You must be logged in as admin.");
      return;
    }
    if (!validateLesson()) {
      setMessage("❌ Please fix the errors before submitting.");
      return;
    }

    // Assign incremental numeric IDs starting from 1 for server
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

  const deleteLesson = async (lessonId) => {
    if (!adminId) return;
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    setMessage("Deleting...");
    try {
      const res = await fetch(
        `${API}/admin/lessons/${lessonId}?userId=${adminId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error(await res.text());

      setMessage("✅ Lesson deleted successfully!");
      fetchLessons();
    } catch (err) {
      setMessage(`❌ Error deleting lesson: ${err.message}`);
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
          <h4 className="text-xl font-semibold flex items-center gap-2">
            Quiz Questions{" "}
            <button
              onClick={addQuiz}
              className="ml-auto bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
              type="button"
              aria-label="Add Quiz"
            >
              <AiOutlinePlus size={18} /> Add Quiz
            </button>
          </h4>

          {newLesson.quiz.map((q, index) => (
            <motion.div
              key={q.id}
              className="relative bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-3"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <details open>
                <summary className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Quiz #{index + 1}: {q.topic || "(No topic)"}
                  </span>
                  {newLesson.quiz.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteQuiz(q.id);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm ml-4 flex items-center gap-1"
                      title="Remove this quiz"
                      type="button"
                      aria-label={`Remove Quiz #${index + 1}`}
                    >
                      <AiOutlineClose size={16} /> Remove
                    </button>
                  )}
                </summary>

                <div className="mt-3 space-y-2">
                  <input
                    value={q.topic}
                    onChange={(e) =>
                      handleQuizChange(q.id, "topic", e.target.value)
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
                      handleQuizChange(q.id, "question", e.target.value)
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
                        handleOptionChange(q.id, optIndex, e.target.value)
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
                      handleQuizChange(q.id, "answer", e.target.value)
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
                      handleQuizChange(q.id, "explanation", e.target.value)
                    }
                    placeholder="Explanation"
                    className="w-full p-2 border rounded"
                  />
                  {errors.quiz?.[index]?.explanation && (
                    <p className="text-red-500 text-sm">
                      {errors.quiz[index].explanation}
                    </p>
                  )}
                </div>
              </details>
            </motion.div>
          ))}
        </div>

        <button
          onClick={submitLesson}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
          type="button"
          aria-label="Submit Lesson"
        >
          Submit Lesson
        </button>

        {message && (
          <div
            className={`mt-3 flex items-center gap-2 font-semibold ${
              message.startsWith("✅")
                ? "text-green-600"
                : message.startsWith("❌")
                ? "text-red-600"
                : "text-gray-600"
            }`}
            aria-live="polite"
          >
            {message.startsWith("✅") && <AiOutlineCheckCircle size={20} />}
            {message.startsWith("❌") && <AiOutlineCloseCircle size={20} />}
            <span>{message.replace(/^✅|❌/, "")}</span>
          </div>
        )}
      </motion.div>

      {/* Existing Lessons List */}
      <div>
        <h3 className="text-3xl font-bold mb-4">Existing Lessons</h3>
        {loading && <p>Loading lessons...</p>}

        {!loading && lessons.length === 0 && <p>No lessons found.</p>}

        {!loading &&
          lessons.map((lesson) => (
            <motion.div
              key={lesson._id}
              className="border p-4 mb-4 rounded-lg bg-white dark:bg-gray-900 shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <details>
                <summary className="cursor-pointer flex justify-between items-center font-semibold text-lg">
                  <span>{lesson.topic}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteLesson(lesson._id);
                    }}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    aria-label={`Delete lesson ${lesson.topic}`}
                    title="Delete lesson"
                    type="button"
                  >
                    <AiOutlineDelete size={20} /> Delete
                  </button>
                </summary>

                <div className="mt-3 whitespace-pre-wrap">{lesson.content}</div>

                {lesson.quiz && lesson.quiz.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h5 className="font-semibold text-lg">Quizzes:</h5>

                    {lesson.quiz.map((q, idx) => (
                      <details
                        key={q.id || idx}
                        className="border p-3 rounded bg-gray-50 dark:bg-gray-800"
                      >
                        <summary className="cursor-pointer font-medium">
                          Quiz #{idx + 1}: {q.topic || "(No topic)"}
                        </summary>
                        <div className="mt-2 space-y-2">
                          <p>
                            <strong>Question:</strong> {q.question}
                          </p>
                          <div>
                            <strong>Options:</strong>
                            <ul className="list-disc list-inside ml-4">
                              {q.options.map((opt, i) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                          </div>
                          <p>
                            <strong>Answer:</strong> {q.answer}
                          </p>
                          <p>
                            <strong>Explanation:</strong> {q.explanation}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </details>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default LessonManager;

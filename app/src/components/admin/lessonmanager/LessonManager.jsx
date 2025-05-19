"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import API from "../../../utils/api";
import Loader from "../../loader/Loader";

import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";

// Create an empty question
const createEmptyQuestion = () => ({
  id: `${Date.now()}-${Math.random()}`,
  question: "",
  options: ["", "", "", ""],
  answer: "",
  explanation: "",
});

// Create an empty quiz (with one empty question)
const createEmptyQuiz = () => ({
  topic: "",
  questions: [createEmptyQuestion()],
});

const initialLessonState = {
  topic: "",
  content: "",
  quiz: [createEmptyQuiz()],
};

// Helper: Convert flat array of questions to quiz array
function convertFlatQuestionsToQuiz(flatQuestions, quizTopic = "Passwords") {
  return [
    {
      topic: quizTopic,
      questions: flatQuestions.map((q) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
      })),
    },
  ];
}

const LessonManager = () => {
  const { data: session } = useSession();
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState(initialLessonState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Per-quiz JSON mode states
  const [quizInputModes, setQuizInputModes] = useState(["form"]);
  const [quizJsons, setQuizJsons] = useState([""]);
  const [quizJsonErrors, setQuizJsonErrors] = useState([""]);

  // Keep per-quiz states in sync with quizzes
  useEffect(() => {
    setQuizInputModes((prev) =>
      Array(newLesson.quiz.length)
        .fill("form")
        .map((_, i) => prev[i] || "form")
    );
    setQuizJsons((prev) =>
      Array(newLesson.quiz.length)
        .fill("")
        .map((_, i) => prev[i] || "")
    );
    setQuizJsonErrors((prev) =>
      Array(newLesson.quiz.length)
        .fill("")
        .map((_, i) => prev[i] || "")
    );
  }, [newLesson.quiz.length]);

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

  // Quiz-level changes
  const handleQuizChange = (quizIdx, field, value) => {
    setNewLesson((prev) => {
      const updatedQuiz = prev.quiz.map((quiz, idx) =>
        idx === quizIdx ? { ...quiz, [field]: value } : quiz
      );
      return { ...prev, quiz: updatedQuiz };
    });
  };

  // Question-level changes
  const handleQuestionChange = (quizIdx, questionIdx, field, value) => {
    setNewLesson((prev) => {
      const updatedQuiz = prev.quiz.map((quiz, idx) => {
        if (idx === quizIdx) {
          const updatedQuestions = quiz.questions.map((q, qIdx) =>
            qIdx === questionIdx ? { ...q, [field]: value } : q
          );
          return { ...quiz, questions: updatedQuestions };
        }
        return quiz;
      });
      return { ...prev, quiz: updatedQuiz };
    });
  };

  // Option-level changes
  const handleOptionChange = (quizIdx, questionIdx, optionIdx, value) => {
    setNewLesson((prev) => {
      const updatedQuiz = prev.quiz.map((quiz, idx) => {
        if (idx === quizIdx) {
          const updatedQuestions = quiz.questions.map((q, qIdx) => {
            if (qIdx === questionIdx) {
              const newOptions = [...q.options];
              newOptions[optionIdx] = value;
              let newAnswer = q.answer;
              if (q.answer === q.options[optionIdx]) {
                newAnswer = value;
              }
              return { ...q, options: newOptions, answer: newAnswer };
            }
            return q;
          });
          return { ...quiz, questions: updatedQuestions };
        }
        return quiz;
      });
      return { ...prev, quiz: updatedQuiz };
    });
  };

  // Add a new quiz
  const addQuiz = () => {
    setNewLesson((prev) => ({
      ...prev,
      quiz: [...prev.quiz, createEmptyQuiz()],
    }));
  };

  // Delete a quiz
  const deleteQuiz = (quizIdx) => {
    setNewLesson((prev) => {
      const filteredQuiz = prev.quiz.filter((_, idx) => idx !== quizIdx);
      return {
        ...prev,
        quiz: filteredQuiz.length > 0 ? filteredQuiz : [createEmptyQuiz()],
      };
    });
  };

  // Add a question to a quiz
  const addQuestion = (quizIdx) => {
    setNewLesson((prev) => {
      const updatedQuiz = prev.quiz.map((quiz, idx) =>
        idx === quizIdx
          ? { ...quiz, questions: [...quiz.questions, createEmptyQuestion()] }
          : quiz
      );
      return { ...prev, quiz: updatedQuiz };
    });
  };

  // Delete a question from a quiz
  const deleteQuestion = (quizIdx, questionIdx) => {
    setNewLesson((prev) => {
      const updatedQuiz = prev.quiz.map((quiz, idx) => {
        if (idx === quizIdx) {
          const filteredQuestions = quiz.questions.filter(
            (_, qIdx) => qIdx !== questionIdx
          );
          return {
            ...quiz,
            questions:
              filteredQuestions.length > 0
                ? filteredQuestions
                : [createEmptyQuestion()],
          };
        }
        return quiz;
      });
      return { ...prev, quiz: updatedQuiz };
    });
  };

  // Validation
  const validateLesson = () => {
    const errs = {};
    if (!newLesson.topic.trim()) errs.topic = "Topic is required.";
    if (!newLesson.content.trim()) errs.content = "Content is required.";

    const quizErrors = newLesson.quiz.map((quiz) => {
      const quizErr = {};
      if (!quiz.topic.trim()) quizErr.topic = "Quiz topic required";
      const questionErrors = quiz.questions.map((q) => {
        const qErr = {};
        if (!q.question.trim()) qErr.question = "Question required";
        if (q.options.some((opt) => !opt.trim()))
          qErr.options = "All 4 options are required";
        if (!q.answer.trim()) qErr.answer = "Answer required";
        if (!q.explanation.trim()) qErr.explanation = "Explanation required";
        return Object.keys(qErr).length > 0 ? qErr : null;
      });
      if (questionErrors.some((q) => q !== null))
        quizErr.questions = questionErrors;
      return Object.keys(quizErr).length > 0 ? quizErr : null;
    });

    if (quizErrors.some((q) => q !== null)) errs.quiz = quizErrors;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit
  const submitLesson = async () => {
    if (!adminId) {
      setMessage("❌ You must be logged in as admin.");
      return;
    }
    if (!validateLesson()) {
      setMessage("❌ Please fix the errors before submitting.");
      return;
    }

    const lessonToSend = {
      ...newLesson,
      quiz: newLesson.quiz.map((quiz) => ({
        topic: quiz.topic,
        questions: quiz.questions.map((q, i) => ({
          ...q,
          id: i + 1,
        })),
      })),
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

  // Delete lesson
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

      {/* Lesson Create Form */}
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

        {/* Quizzes */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold flex items-center gap-2">
            Quizzes
          </h4>
          <button
            onClick={addQuiz}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
            type="button"
            aria-label="Add Quiz"
          >
            <AiOutlinePlus size={18} /> Add Quiz
          </button>
          {newLesson.quiz.map((quiz, quizIdx) => (
            <motion.div
              key={quizIdx}
              className="relative bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-3"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <details open>
                <summary className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Quiz #{quizIdx + 1}: {quiz.topic || "(No topic)"}
                  </span>
                  {newLesson.quiz.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteQuiz(quizIdx);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm ml-4 flex items-center gap-1"
                      title="Remove this quiz"
                      type="button"
                      aria-label={`Remove Quiz #${quizIdx + 1}`}
                    >
                      <AiOutlineClose size={16} /> Remove
                    </button>
                  )}
                </summary>

                {/* Per-quiz Form/JSON toggle */}
                <div className="flex gap-2 mt-2 mb-2">
                  <button
                    type="button"
                    className={`px-2 py-1 rounded ${
                      quizInputModes[quizIdx] === "form"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      setQuizInputModes((prev) =>
                        prev.map((mode, i) => (i === quizIdx ? "form" : mode))
                      )
                    }
                  >
                    Form
                  </button>
                  <button
                    type="button"
                    className={`px-2 py-1 rounded ${
                      quizInputModes[quizIdx] === "json"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => {
                      setQuizInputModes((prev) =>
                        prev.map((mode, i) => (i === quizIdx ? "json" : mode))
                      );
                      setQuizJsons((prev) =>
                        prev.map((json, i) =>
                          i === quizIdx ? JSON.stringify([quiz], null, 2) : json
                        )
                      );
                      setQuizJsonErrors((prev) =>
                        prev.map((err, i) => (i === quizIdx ? "" : err))
                      );
                    }}
                  >
                    JSON
                  </button>
                </div>

                {quizInputModes[quizIdx] === "json" ? (
                  <div>
                    <textarea
                      value={quizJsons[quizIdx]}
                      onChange={(e) =>
                        setQuizJsons((prev) =>
                          prev.map((json, i) =>
                            i === quizIdx ? e.target.value : json
                          )
                        )
                      }
                      rows={10}
                      className="w-full p-2 border rounded font-mono"
                      placeholder='Paste quiz JSON here. Example: [{"topic":"...","questions":[...]}]'
                    />
                    {quizJsonErrors[quizIdx] && (
                      <p className="text-red-500 text-sm">
                        {quizJsonErrors[quizIdx]}
                      </p>
                    )}
                    <button
                      type="button"
                      className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(quizJsons[quizIdx]);
                          let quizArray;
                          if (
                            Array.isArray(parsed) &&
                            parsed.length > 0 &&
                            parsed[0].question &&
                            parsed[0].options
                          ) {
                            quizArray = convertFlatQuestionsToQuiz(
                              parsed,
                              quiz.topic
                            );
                          } else if (
                            Array.isArray(parsed) &&
                            parsed.length > 0 &&
                            parsed[0].questions
                          ) {
                            quizArray = parsed;
                          } else {
                            throw new Error(
                              "JSON must be an array of questions or quizzes."
                            );
                          }
                          quizArray.forEach((quiz, idx) => {
                            if (typeof quiz.topic !== "string")
                              throw new Error(`Quiz #${idx + 1} missing topic`);
                            if (!Array.isArray(quiz.questions))
                              throw new Error(
                                `Quiz #${idx + 1} missing questions array`
                              );
                          });
                          setNewLesson((prev) => {
                            const updatedQuiz = prev.quiz.map((q, i) =>
                              i === quizIdx ? quizArray[0] : q
                            );
                            return { ...prev, quiz: updatedQuiz };
                          });
                          setQuizJsonErrors((prev) =>
                            prev.map((err, i) => (i === quizIdx ? "" : err))
                          );
                          setQuizInputModes((prev) =>
                            prev.map((mode, i) =>
                              i === quizIdx ? "form" : mode
                            )
                          );
                        } catch (err) {
                          setQuizJsonErrors((prev) =>
                            prev.map((error, i) =>
                              i === quizIdx
                                ? "Invalid JSON: " + err.message
                                : error
                            )
                          );
                        }
                      }}
                    >
                      Apply JSON
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <input
                      value={quiz.topic}
                      onChange={(e) =>
                        handleQuizChange(quizIdx, "topic", e.target.value)
                      }
                      placeholder="Quiz Topic (e.g., Password Security)"
                      className="w-full p-2 border rounded mb-2"
                      aria-label={`Quiz #${quizIdx + 1} Topic`}
                      autoFocus={quizIdx === 0}
                      required
                    />
                    {errors.quiz?.[quizIdx]?.topic && (
                      <p className="text-red-500 text-sm">
                        {errors.quiz[quizIdx].topic}
                      </p>
                    )}

                    {/* Questions for this quiz */}
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center gap-2">
                        <strong>Questions</strong>
                        <button
                          onClick={() => addQuestion(quizIdx)}
                          className="ml-auto bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                          type="button"
                          aria-label="Add Question"
                        >
                          <AiOutlinePlus size={16} /> Add Question
                        </button>
                      </div>
                      {quiz.questions.map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="bg-gray-50 dark:bg-gray-700 p-3 rounded space-y-2 relative"
                        >
                          {quiz.questions.length > 1 && (
                            <button
                              onClick={() => deleteQuestion(quizIdx, qIdx)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              type="button"
                              aria-label="Remove Question"
                            >
                              <AiOutlineClose size={14} />
                            </button>
                          )}
                          <input
                            value={q.question}
                            onChange={(e) =>
                              handleQuestionChange(
                                quizIdx,
                                qIdx,
                                "question",
                                e.target.value
                              )
                            }
                            placeholder="Question"
                            className="w-full p-2 border rounded"
                          />
                          {errors.quiz?.[quizIdx]?.questions?.[qIdx]
                            ?.question && (
                            <p className="text-red-500 text-sm">
                              {errors.quiz[quizIdx].questions[qIdx].question}
                            </p>
                          )}

                          <div>
                            <strong>Options:</strong>
                            <ul className="space-y-2 mt-2">
                              {q.options.map((opt, optIndex) => (
                                <li
                                  key={optIndex}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    name={`correctOption-${quizIdx}-${q.id}`}
                                    checked={q.answer === opt}
                                    onChange={() =>
                                      handleQuestionChange(
                                        quizIdx,
                                        qIdx,
                                        "answer",
                                        opt
                                      )
                                    }
                                    className="accent-green-600"
                                    aria-label={`Mark as correct option ${
                                      optIndex + 1
                                    }`}
                                  />
                                  <input
                                    value={opt}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        quizIdx,
                                        qIdx,
                                        optIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Option ${optIndex + 1}`}
                                    className="w-full p-2 border rounded"
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                          {errors.quiz?.[quizIdx]?.questions?.[qIdx]
                            ?.options && (
                            <p className="text-red-500 text-sm">
                              {errors.quiz[quizIdx].questions[qIdx].options}
                            </p>
                          )}
                          {errors.quiz?.[quizIdx]?.questions?.[qIdx]
                            ?.answer && (
                            <p className="text-red-500 text-sm">
                              {errors.quiz[quizIdx].questions[qIdx].answer}
                            </p>
                          )}

                          <textarea
                            value={q.explanation}
                            onChange={(e) =>
                              handleQuestionChange(
                                quizIdx,
                                qIdx,
                                "explanation",
                                e.target.value
                              )
                            }
                            placeholder="Explanation"
                            className="w-full p-2 border rounded"
                          />
                          {errors.quiz?.[quizIdx]?.questions?.[qIdx]
                            ?.explanation && (
                            <p className="text-red-500 text-sm">
                              {errors.quiz[quizIdx].questions[qIdx].explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

      {/* Existing Lessons */}
      <div>
        <h3 className="text-3xl font-bold mb-4">Existing Lessons</h3>
        {loading && <Loader />}

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

                    {lesson.quiz.map((quiz, quizIdx) => (
                      <details
                        key={quizIdx}
                        className="border p-3 rounded bg-gray-50 dark:bg-gray-800"
                      >
                        <summary className="cursor-pointer font-medium">
                          Quiz #{quizIdx + 1}: {quiz.topic || "(No topic)"}
                        </summary>
                        <div className="mt-2 space-y-2">
                          {quiz.questions && quiz.questions.length > 0 ? (
                            quiz.questions.map((q, qIdx) => (
                              <div key={q.id || qIdx} className="mb-4">
                                <p>
                                  <strong>Question {qIdx + 1}:</strong>{" "}
                                  {q.question}
                                </p>
                                <div>
                                  <strong>Options:</strong>
                                  <ul className="list-disc list-inside ml-4">
                                    {q.options.map((opt, i) => (
                                      <li
                                        key={i}
                                        className={
                                          opt === q.answer
                                            ? "text-green-700 font-semibold"
                                            : ""
                                        }
                                      >
                                        {opt}
                                        {opt === q.answer && (
                                          <span className="ml-2 text-green-600 font-bold">
                                            (Correct)
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <p>
                                  <strong>Explanation:</strong> {q.explanation}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No questions in this quiz.</p>
                          )}
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

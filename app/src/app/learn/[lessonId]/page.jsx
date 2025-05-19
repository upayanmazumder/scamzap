"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../../components/loader/Loader";
import API from "../../../utils/api";
import { useSession } from "next-auth/react";

export default function LessonDetail() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz selection & navigation state
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Track saving progress
  const [saving, setSaving] = useState(false);

  // Store and reflect progress for this lesson
  const [lessonProgress, setLessonProgress] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`${API}/lessons/${id}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch lesson and progress
    const fetchProgress = async () => {
      if (!session?.user?.sub) return;
      try {
        const res = await fetch(`${API}/users/${session.user.sub}/progress`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setLessonProgress(data.find((p) => p.lessonId === id) || null);
        }
      } catch (err) {
        setLessonProgress(null);
      }
    };

    if (id) fetchLesson();
    if (id && session?.user?.sub) fetchProgress();
  }, [id, session?.user?.sub]);

  // Save progress to backend and update local state
  const saveProgress = async (completed = false, quizIdx = null) => {
    if (!session?.user?.sub || !lesson?._id) return;
    setSaving(true);

    // Prepare quizzes progress
    let quizzesProgress = lessonProgress?.quizzes || [];
    if (quizIdx !== null && lesson.quiz && lesson.quiz[quizIdx]) {
      // Mark this quiz as completed if needed
      const quizId =
        lesson.quiz[quizIdx]._id || lesson.quiz[quizIdx].id || quizIdx;
      const existingQuiz = quizzesProgress.find((q) => q.quizId === quizId);
      if (existingQuiz) {
        existingQuiz.completed = completed;
      } else {
        quizzesProgress.push({
          quizId,
          completed,
          score: null,
          lastQuestion: null,
        });
      }
    }

    try {
      const res = await fetch(`${API}/users/${session.user.sub}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson._id,
          completed,
          quizzes: quizzesProgress,
          lastAccessed: new Date(),
        }),
      });
      if (res.ok) {
        // Update local progress state
        setLessonProgress((prev) => ({
          ...(prev || {}),
          lessonId: lesson._id,
          completed,
          quizzes: quizzesProgress,
          lastAccessed: new Date(),
        }));
      }
    } catch (err) {
      console.error("Failed to save progress:", err);
    } finally {
      setSaving(false);
    }
  };

  // Save progress when quiz is completed
  useEffect(() => {
    if (
      quizCompleted &&
      lesson &&
      lesson._id &&
      session?.user?.sub &&
      selectedQuizIndex !== null
    ) {
      saveProgress(true, selectedQuizIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizCompleted]);

  if (loading)
    return (
      <main>
        <Loader />
      </main>
    );

  if (!lesson || lesson.error)
    return <p className="text-center text-red-600 mt-10">Lesson not found.</p>;

  // If no quizzes available
  if (!lesson.quiz || lesson.quiz.length === 0)
    return (
      <p className="text-center mt-10">No quizzes available for this lesson.</p>
    );

  // If quiz is not selected, show quiz selection list
  if (selectedQuizIndex === null) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Select a Quiz</h2>
        <ul className="space-y-4">
          {lesson.quiz.map((quiz, idx) => {
            // Reflect quiz progress
            let quizStatus = "";
            if (
              lessonProgress &&
              Array.isArray(lessonProgress.quizzes) &&
              lessonProgress.quizzes.length > 0
            ) {
              const quizId = quiz._id || quiz.id || idx;
              const quizProg = lessonProgress.quizzes.find(
                (q) => q.quizId === quizId
              );
              if (quizProg?.completed) quizStatus = "✅ Completed";
              else if (quizProg) quizStatus = "🕒 In Progress";
            }
            return (
              <motion.li
                key={quiz.id || quiz._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => {
                    setSelectedQuizIndex(idx);
                    setCurrentIndex(0);
                    setSelectedOption(null);
                    setShowAnswer(false);
                    setQuizCompleted(false);
                    // Save "in progress" when quiz starts
                    saveProgress(false, idx);
                  }}
                  className="w-full text-left px-4 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-between"
                >
                  <span>
                    {quiz.topic} ({quiz.questions ? quiz.questions.length : 0}{" "}
                    questions)
                  </span>
                  {quizStatus && (
                    <span className="ml-4 text-xs text-gray-200">
                      {quizStatus}
                    </span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
        {lessonProgress && lessonProgress.completed && (
          <div className="mt-6 text-green-700 text-center font-semibold">
            Lesson Completed!
          </div>
        )}
      </main>
    );
  }

  // Quiz selected, get questions of that quiz
  const currentQuiz = lesson.quiz[selectedQuizIndex];
  const questions = Array.isArray(currentQuiz.questions)
    ? currentQuiz.questions
    : [];
  const quizLength = questions.length;
  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    if (currentIndex + 1 < quizLength) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <main>
      {!quizCompleted && (
        <div className="w-full h-4 bg-gray-300 rounded mb-6">
          <div
            className="h-full bg-[var(--theme-green)] transition-all duration-300 rounded"
            style={{
              width: `${
                ((currentIndex + (showAnswer ? 1 : 0)) / quizLength) * 100
              }%`,
            }}
          ></div>
        </div>
      )}

      <div className="px-6 h-[calc(100vh-4rem)] overflow-y-auto">
        <section className="h-full">
          {quizCompleted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[var(--foreground)] text-xl font-semibold flex flex-col items-center gap-6 mt-10 h-full justify-center"
            >
              🎉 You have completed the quiz! Great job!
              <button
                onClick={() => {
                  setSelectedQuizIndex(null);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Quizzes
              </button>
              <button
                onClick={() => router.push("/learn")}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Back to Lessons
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id || currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8 h-full w-full flex flex-col justify-center"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">
                      Q{currentIndex + 1}: {currentQuestion.question}
                    </h3>
                  </div>

                  <ul className="space-y-3 mb-16">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      const isCorrect = option === currentQuestion.answer;

                      let optionClass =
                        "cursor-pointer rounded-md border px-4 py-2 select-none";
                      if (showAnswer) {
                        if (isCorrect) {
                          optionClass +=
                            " bg-green-200 border-green-500 text-green-900 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          optionClass +=
                            " bg-red-200 border-red-500 text-red-900 font-semibold line-through";
                        } else {
                          optionClass += " opacity-70 cursor-default";
                        }
                      } else {
                        optionClass +=
                          " hover:bg-blue-100 text-[var(--foreground)]";
                      }

                      return (
                        <li
                          key={idx}
                          className={optionClass}
                          onClick={() => handleOptionClick(option)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleOptionClick(option);
                            }
                          }}
                          aria-pressed={isSelected}
                          role="button"
                        >
                          {option}
                        </li>
                      );
                    })}
                  </ul>

                  {showAnswer && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[30rem] bg-gray-700 shadow-lg border border-gray-300 rounded-2xl px-6 py-4 z-50"
                    >
                      <p className="text-[var(--theme-black)] mb-4">
                        {currentQuestion.explanation}
                      </p>
                      <button onClick={handleNextQuestion} className="w-full">
                        {currentIndex + 1 < quizLength
                          ? "Next Question"
                          : "Finish Quiz"}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";
import API from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function LearnJourney() {
  const { data: session, status } = useSession();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // For quiz modal/section
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedQuizIdx, setSelectedQuizIdx] = useState(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    const fetchLessonsAndProgress = async () => {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          fetch(`${API}/lessons`),
          fetch(`${API}/users/${session.user.sub}/progress`),
        ]);
        const lessonsData = await lessonsRes.json();
        const progressData = await progressRes.json();

        const normalized = Array.isArray(lessonsData)
          ? lessonsData.map((lesson) => ({
              ...lesson,
              quiz: Array.isArray(lesson.quiz) ? lesson.quiz : [],
            }))
          : [];
        setLessons(normalized);
        setProgress(Array.isArray(progressData) ? progressData : []);
      } catch (err) {
        console.error("Failed to fetch lessons or progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsAndProgress();
  }, [session, status]);

  // Helpers
  const getLessonProgress = (lessonId) =>
    progress.find((p) => p.lessonId === lessonId);

  const getQuizProgress = (lessonId, quizId) => {
    const lessonProg = getLessonProgress(lessonId);
    if (!lessonProg || !lessonProg.quizzes) return null;
    return lessonProg.quizzes.find((q) => q.quizId === quizId);
  };

  // Quiz modal open/close
  const openQuiz = (lessonId, quizIdx) => {
    setSelectedLessonId(lessonId);
    setSelectedQuizIdx(quizIdx);
  };
  const closeQuiz = () => {
    setSelectedLessonId(null);
    setSelectedQuizIdx(null);
  };

  // Dummy quiz section (replace with your real quiz logic)
  function QuizSection({ lesson, quizIdx, onClose }) {
    const quiz = lesson.quiz[quizIdx];
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full shadow-2xl relative">
          <button
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700"
            onClick={onClose}
          >
            ✖
          </button>
          <h3 className="text-2xl font-bold mb-2 text-blue-600 flex items-center gap-2">
            <FaBookOpen /> {lesson.topic}
          </h3>
          <div className="mb-4">
            <span className="font-semibold text-gray-700">
              Quiz: {quiz.topic}
            </span>
          </div>
          <div className="text-gray-600 mb-4">
            {/* Replace with real quiz content */}
            <p>This is a placeholder for the quiz content.</p>
          </div>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={onClose}
          >
            Finish Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <Loader />
      </main>
    );
  }

  if (status !== "authenticated") {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">
          Please sign in to view your lessons.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div>
        {lessons.map((lesson, lessonIdx) => {
          const lessonProgress = getLessonProgress(lesson._id);
          // Calculate progress percentage if quizzes exist
          let progressPercent = 0;
          if (
            lesson.quiz.length > 0 &&
            lessonProgress &&
            lessonProgress.quizzes &&
            lessonProgress.quizzes.length > 0
          ) {
            const completedQuizzes = lessonProgress.quizzes.filter(
              (q) => q.completed
            ).length;
            progressPercent = Math.round(
              (completedQuizzes / lesson.quiz.length) * 100
            );
          }
          return (
            <section
              key={lesson._id}
              className="mb-20 flex flex-col items-center w-full"
            >
              <h2 className="text-2xl font-bold mb-2 text-center flex items-center gap-2">
                <FaBookOpen className="text-blue-500" /> {lesson.topic}
              </h2>
              <div className="flex items-center justify-center mb-4">
                <span className="text-sm text-gray-500">
                  {lesson.quiz.length} quiz
                  {lesson.quiz.length > 1 ? "zes" : ""}
                </span>
                {lessonProgress && (
                  <span
                    className={`ml-4 px-2 py-1 rounded text-xs ${
                      lessonProgress.completed === true
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {lesson.quiz.length > 0 &&
                    lessonProgress.quizzes &&
                    lessonProgress.quizzes.length > 0
                      ? lessonProgress.quizzes.filter((q) => q.completed)
                          .length === lesson.quiz.length
                        ? "Completed"
                        : "In Progress"
                      : lessonProgress.completed
                      ? "Completed"
                      : "In Progress"}
                  </span>
                )}
                {!lessonProgress && lesson.quiz.length > 0 && (
                  <span className="ml-4 px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                    Not started
                  </span>
                )}
                {lesson.quiz.length > 0 && (
                  <span className="ml-4 text-xs text-gray-500">
                    {progressPercent}% done
                  </span>
                )}
              </div>
              {/* Timeline */}
              <div className="relative w-full max-w-3xl mx-auto py-12">
                {/* Vertical line - stretches full height */}
<div className="absolute left-1/2 top-[130px] bottom-[130px] w-1 bg-blue-200 -translate-x-1/2 z-0"></div>
                <div className="flex flex-col gap-20">
                  {lesson.quiz.map((quiz, quizIdx) => {
                    const quizProgress = getQuizProgress(lesson._id, quiz._id);
                    const isLeft = quizIdx % 2 === 0;
                    return (
                      <div
                        key={quiz._id}
                        className="relative flex items-center min-h-[140px]"
                      >
                        {/* Connector line above circle (except first) */}
                        {quizIdx !== 0 && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-1 h-20 bg-blue-200 z-0"></div>
                        )}
                        {/* Left side */}
                        <div className={`w-1/2 flex ${isLeft ? "justify-end pr-8" : ""}`}>
                          {isLeft && (
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.97 }}
                              className={`
                                w-20 h-20 rounded-full flex items-center justify-center
                                text-2xl font-bold shadow-lg border-2 transition-all
                                relative z-10
                                ${
                                  quizProgress?.completed
                                    ? "bg-green-200 border-green-400 text-green-900"
                                    : quizProgress
                                    ? "bg-yellow-100 border-yellow-400 text-yellow-900"
                                    : "bg-gray-100 border-gray-400 text-gray-700"
                                }
                              `}
                              onClick={() => openQuiz(lesson._id, quizIdx)}
                            >
                              {quizProgress?.completed
                                ? "✅"
                                : quizProgress
                                ? "🕒"
                                : "❓"}
                            </motion.button>
                          )}
                        </div>
                        {/* Timeline dot */}
                        <div className="absolute left-1/2 -translate-x-1/2 z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-400 border-4 border-white shadow-md"></div>
                        </div>
                        {/* Right side */}
                        <div className={`w-1/2 flex ${!isLeft ? "justify-start pl-8" : ""}`}>
                          {!isLeft && (
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.97 }}
                              className={`
                                w-20 h-20 rounded-full flex items-center justify-center
                                text-2xl font-bold shadow-lg border-2 transition-all
                                relative z-10
                                ${
                                  quizProgress?.completed
                                    ? "bg-green-200 border-green-400 text-green-900"
                                    : quizProgress
                                    ? "bg-yellow-100 border-yellow-400 text-yellow-900"
                                    : "bg-gray-100 border-gray-400 text-gray-700"
                                }
                              `}
                              onClick={() => openQuiz(lesson._id, quizIdx)}
                            >
                              {quizProgress?.completed
                                ? "✅"
                                : quizProgress
                                ? "🕒"
                                : "❓"}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Quiz Modal */}
              <AnimatePresence>
                {selectedLessonId === lesson._id &&
                  selectedQuizIdx !== null && (
                    <QuizSection
                      lesson={lesson}
                      quizIdx={selectedQuizIdx}
                      onClose={closeQuiz}
                    />
                  )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </main>
  );
}

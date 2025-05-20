"use client";

import { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";
import API from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Accordion from "@radix-ui/react-accordion";

export default function LearnJourney() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalQuiz, setModalQuiz] = useState(null);
  const [modalLesson, setModalLesson] = useState(null);

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

  const getLessonProgress = (lessonId) =>
    progress.find((p) => p.lessonId === lessonId);

  const getQuizProgress = (lessonId, quizId) => {
    const lessonProgress = getLessonProgress(lessonId);
    if (!lessonProgress) return null;
    return lessonProgress.quizzes.find((q) => q.quizId === quizId);
  };

  const handleQuizCircleClick = (lesson, quiz) => {
    setModalLesson(lesson);
    setModalQuiz(quiz);
  };

  const handleModalClose = () => {
    setModalLesson(null);
    setModalQuiz(null);
  };

  const handleStartQuiz = () => {
    if (modalLesson && modalQuiz) {
      router.push(`/learn/${modalLesson._id}/quiz/${modalQuiz._id}`);
      handleModalClose();
    }
  };

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
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
      <Accordion.Root
        type="single"
        collapsible
        className="w-full max-w-4xl space-y-4"
      >
        {lessons.map((lesson) => {
          const lessonProgress = getLessonProgress(lesson._id);
          let progressPercent = 0;
          if (
            lesson.quiz.length > 0 &&
            lessonProgress &&
            lessonProgress.quizzes?.length > 0
          ) {
            const completedQuizzes = lessonProgress.quizzes.filter(
              (q) => q.completed
            ).length;
            progressPercent = Math.round(
              (completedQuizzes / lesson.quiz.length) * 100
            );
          }

          return (
            <Accordion.Item
              key={lesson._id}
              value={lesson._id}
              className="overflow-hidden"
            >
              <Accordion.Header>
                <Accordion.Trigger className="w-full bg-[#F89C3B] text-[#164A78] px-6 py-4 flex justify-between items-center font-semibold text-lg hover:bg-[#fca652] transition-all">
                  <div className="flex flex-col text-left">
                    <span className="text-xl font-bold">{lesson.topic}</span>
                    <span className="text-sm">
                      {lesson.quiz.length} quiz
                      {lesson.quiz.length !== 1 ? "zes" : ""} —{" "}
                      {progressPercent}% done
                    </span>
                  </div>
                  <motion.span
                    className="text-xl"
                    animate={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▶
                  </motion.span>
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content asChild>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="relative w-full max-w-3xl mx-auto py-12 px-4">
                    <div className="absolute left-1/2 top-[130px] bottom-[130px] w-1 bg-blue-200 -translate-x-1/2 z-0"></div>
                    <div className="flex flex-col gap-20">
                      {lesson.quiz.map((quiz, quizIdx) => {
                        const quizProgress = getQuizProgress(
                          lesson._id,
                          quiz._id
                        );
                        const isLeft = quizIdx % 2 === 0;

                        return (
                          <div
                            key={quiz._id}
                            className="relative flex items-center min-h-[160px]"
                          >
                            {quizIdx !== 0 && (
                              <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-1 h-20 bg-blue-200 z-0"></div>
                            )}

                            <div
                              className={`w-1/2 flex ${
                                isLeft ? "justify-end pr-6" : "justify-end"
                              }`}
                            >
                              {isLeft && (
                                <>
                                  <div className="flex flex-col items-end text-right mr-4 max-w-xs">
                                    <span className="text-md font-semibold text-blue-400">
                                      {quiz.topic}
                                    </span>
                                    <motion.button
                                      whileHover={{ scale: 1.08 }}
                                      whileTap={{ scale: 0.97 }}
                                      className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2 transition-all relative z-10"
                                      style={{
                                        backgroundColor: quizProgress?.completed
                                          ? "#2ECC71"
                                          : "#F89C3B",
                                      }}
                                      onClick={() =>
                                        handleQuizCircleClick(lesson, quiz)
                                      }
                                    >
                                      <FaStar
                                        className="text-[#164A78]"
                                        style={{
                                          width: "120px",
                                          height: "120px",
                                        }}
                                      />
                                    </motion.button>
                                    <span className="text-sm text-blue-200 mb-2">
                                      {quiz.questions?.length || 0}{" "}
                                      {quiz.questions?.length === 1
                                        ? "question"
                                        : "questions"}
                                    </span>
                                  </div>
                                  <div className="absolute right-1/2 w-24 h-1 bg-blue-200 top-1/2 -translate-y-1/2 z-0" />
                                </>
                              )}
                            </div>

                            <div className="absolute left-1/2 -translate-x-1/2 z-10">
                              <div className="w-8 h-8 rounded-full bg-blue-400 border-4 border-white shadow-md"></div>
                            </div>

                            <div
                              className={`w-1/2 flex ${
                                !isLeft ? "justify-start pl-6" : "justify-start"
                              }`}
                            >
                              {!isLeft && (
                                <>
                                  <div className="absolute left-1/2 w-24 h-1 bg-blue-200 top-1/2 -translate-y-1/2 z-0" />
                                  <div className="flex flex-col items-start text-left ml-4 max-w-xs">
                                    <span className="text-md font-semibold text-blue-400">
                                      {quiz.topic}
                                    </span>
                                    <motion.button
                                      whileHover={{ scale: 1.08 }}
                                      whileTap={{ scale: 0.97 }}
                                      className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-2 transition-all relative z-10"
                                      style={{
                                        backgroundColor: quizProgress?.completed
                                          ? "#2ECC71"
                                          : "#F89C3B",
                                      }}
                                      onClick={() =>
                                        handleQuizCircleClick(lesson, quiz)
                                      }
                                    >
                                      <FaStar
                                        className="text-[#164A78]"
                                        style={{
                                          width: "120px",
                                          height: "120px",
                                        }}
                                      />
                                    </motion.button>
                                    <span className="text-sm text-blue-200 mb-2">
                                      {quiz.questions?.length || 0}{" "}
                                      {quiz.questions?.length === 1
                                        ? "question"
                                        : "questions"}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>

      {/* Modal */}
      <AnimatePresence>
        {modalQuiz && modalLesson && (
          <motion.div
            key="quiz-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className=" bg-[#164A78] rounded-2xl shadow-2xl p-8 max-w-xs w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={handleModalClose}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-blue-700 mb-2 text-center">
                {modalQuiz.topic}
              </h2>
              <div className="text-center mb-6">
                <span className="block">
                  {modalQuiz.questions?.length || 0} question
                  {modalQuiz.questions?.length !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                onClick={handleStartQuiz}
              >
                Start
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

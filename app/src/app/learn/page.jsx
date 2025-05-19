"use client";

import { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";
import API from "../../utils/api";
import { motion } from "framer-motion";
import { FaBookOpen, FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LearnJourney() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

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

        console.log("Lessons data:", lessonsData);
        console.log("Progress data:", progressData);

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
    const lessonProg = getLessonProgress(lessonId);
    if (!lessonProg || !lessonProg.quizzes) return null;
    return lessonProg.quizzes.find((q) => q.quizId === quizId);
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
    <main className="p-6 max-w-5xl mx-auto">
      <div>
        {lessons.map((lesson) => {
          const lessonProgress = getLessonProgress(lesson._id);
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
                        <div className={`w-1/2 flex ${isLeft ? "justify-end mr-24" : "justify-end"}`}>
                          {isLeft && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.97 }}
                                className={`
                                  w-20 h-20 rounded-full flex items-center justify-center
                                  shadow-lg border-2 transition-all
                                  relative z-10
                                  ${
                                    quizProgress?.completed
                                      ? "bg-green-200 border-green-400"
                                      : quizProgress
                                      ? "bg-yellow-100 border-yellow-400"
                                      : "bg-gray-100 border-gray-400"
                                  }
                                `}
                                onClick={() =>
                                  router.push(`/learn/${lesson._id}/quiz/${quiz._id}`)
                                }
                              >
                                <FaStar
                                  className="text-[#164A78]"
                                  style={{ width: "120px", height: "120px" }}
                                />
                              </motion.button>
                              {/* horizontal line connecting to center */}
                              <div className="absolute right-1/2 w-24 h-1 bg-blue-200 top-1/2 -translate-y-1/2 z-0" />
                            </>
                          )}
                        </div>
                        {/* Timeline dot */}
                        <div className="absolute left-1/2 -translate-x-1/2 z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-400 border-4 border-white shadow-md"></div>
                        </div>
                        {/* Right side */}
                        <div className={`w-1/2 flex ${!isLeft ? "justify-start ml-24" : "justify-start"}`}>
                          {!isLeft && (
                            <>
                              {/* horizontal line connecting to center */}
                              <div className="absolute left-1/2 w-24 h-1 bg-blue-200 top-1/2 -translate-y-1/2 z-0" />
                              <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.97 }}
                                className={`
                                  w-20 h-20 rounded-full flex items-center justify-center
                                  shadow-lg border-2 transition-all
                                  relative z-10
                                  ${
                                    quizProgress?.completed
                                      ? "bg-green-200 border-green-400"
                                      : quizProgress
                                      ? "bg-yellow-100 border-yellow-400"
                                      : "bg-gray-100 border-gray-400"
                                  }
                                `}
                                onClick={() =>
                                  router.push(`/learn/${lesson._id}/quiz/${quiz._id}`)
                                }
                              >
                                <FaStar
                                  className="text-[#164A78]"
                                  style={{ width: "120px", height: "120px" }}
                                />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

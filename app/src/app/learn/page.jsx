"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../../components/loader/Loader";
import API from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Learn() {
  const { data: session, status } = useSession();
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
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">📘 Learn</h1>
        <p className="text-lg text-gray-600">
          Select a lesson to begin your journey.
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {lessons.map((lesson) => {
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
              <motion.li
                key={lesson._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-5"
              >
                <Link href={`/learn/${lesson._id}`} className="block space-y-2">
                  <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                    <FaBookOpen className="inline-block mr-2" />
                    {lesson.topic}
                  </h2>
                  {lesson.quiz.length > 0 && (
                    <p className="text-sm text-gray-500">
                      {lesson.quiz.length} quiz
                      {lesson.quiz.length > 1 ? "zes" : ""}
                    </p>
                  )}
                  {lessonProgress && (
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          lessonProgress.completed
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {lessonProgress.completed ? "Completed" : "In Progress"}
                      </span>
                      {lesson.quiz.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {progressPercent}% done
                        </span>
                      )}
                    </div>
                  )}
                  {!lessonProgress && lesson.quiz.length > 0 && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                        Not started
                      </span>
                    </div>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </main>
  );
}

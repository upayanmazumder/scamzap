"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../../components/loader/Loader";
import API from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

export default function Learn() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`${API}/lessons`);
        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data.map((lesson) => ({
              ...lesson,
              quiz: Array.isArray(lesson.quiz) ? lesson.quiz : [],
            }))
          : [];
        setLessons(normalized);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <Loader />
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
          {lessons.map((lesson) => (
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
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../../components/loader/Loader";
import API from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Learn() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
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

    fetchLessons();
  }, []);

  if (loading)
    return (
      <main>
        <Loader />
      </main>
    );

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learn</h1>
        <p className="text-[var(--foreground)]">
          Select a lesson to start learning.
        </p>
      </div>
      <ul className="space-y-4">
        <AnimatePresence>
          {lessons.map((lesson) => (
            <motion.li
              key={lesson._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/learn/${lesson._id}`}
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                {lesson.topic}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../../components/loader/Loader";
import API from "../../utils/api";

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

  if (loading) return <Loader />;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learn</h1>
        <p className="text-gray-600">Select a lesson to start learning.</p>
      </div>
      <ul className="space-y-4">
        {lessons.map((lesson) => (
          <li key={lesson._id}>
            <Link
              href={`/learn/${lesson._id}`}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              {lesson.topic}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

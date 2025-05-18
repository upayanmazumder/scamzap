"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "../../../components/loader/Loader";
import API from "../../../utils/api";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

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

    if (id) fetchLesson();
  }, [id]);

  if (loading) return <Loader />;
  if (!lesson || lesson.error)
    return <p className="text-center text-red-600 mt-10">Lesson not found.</p>;

  return (
    <main className="p-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">{lesson.topic}</h1>
        <p className="text-gray-700">{lesson.content}</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Quiz</h2>
        {lesson.quiz?.map((q, index) => (
          <div
            key={q._id}
            className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-2">
              Q{index + 1}: {q.question}
            </h3>
            <ul className="list-disc list-inside mb-2 space-y-1 text-gray-800">
              {q.options.map((option, i) => (
                <li key={i}>{option}</li>
              ))}
            </ul>
            <p>
              <strong>Answer:</strong>{" "}
              <span className="text-green-700">{q.answer}</span>
            </p>
            <p className="mt-1 text-gray-600 italic">{q.explanation}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

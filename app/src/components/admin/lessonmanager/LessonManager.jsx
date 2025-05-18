"use client";

import React, { useEffect, useState } from "react";
import API from "../../../utils/api";
import { FaRegCircle, FaRegDotCircle } from "react-icons/fa";

const LessonManager = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API}/lessons`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setLessons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 mt-4">Loading lessons...</p>;
  if (error)
    return (
      <p className="text-center text-red-600 mt-4">
        Failed to load lessons: {error}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6 text-center">Lessons</h2>
      {lessons.length === 0 ? (
        <p className="text-center text-gray-600">No lessons available.</p>
      ) : (
        <ul className="space-y-6">
          {lessons.map((lesson) => (
            <li key={lesson._id} className="border rounded-lg shadow-sm p-4">
              <details className="group">
                <summary
                  className="cursor-pointer font-semibold text-lg text-blue-700
                             list-none outline-none
                             focus-visible:ring-2 focus-visible:ring-blue-500
                             transition-all"
                >
                  {lesson.topic}
                  <span
                    className="inline-block ml-2 transform transition-transform duration-200
                               group-open:rotate-90"
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                </summary>

                <p className="mt-3 text-gray-700">{lesson.content}</p>

                {lesson.quiz && lesson.quiz.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-300">
                    <h4 className="text-xl font-medium mb-3 text-blue-600">
                      Quizzes
                    </h4>
                    <ul className="space-y-4">
                      {lesson.quiz.map((q) => (
                        <li
                          key={q._id}
                          className="bg-gray-700 p-4 rounded-md shadow-sm text-white"
                        >
                          <p className="font-semibold text-blue-300">
                            {q.topic}
                          </p>
                          <p className="mt-1 mb-2">{q.question}</p>
                          <ul className="list-none space-y-1 mb-3">
                            {q.options.map((option, idx) => {
                              const isAnswer = option === q.answer;
                              return (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  {isAnswer ? (
                                    <FaRegDotCircle className="text-green-400" />
                                  ) : (
                                    <FaRegCircle className="text-gray-400" />
                                  )}
                                  <span
                                    className={isAnswer ? "font-semibold" : ""}
                                  >
                                    {option}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                          <p className="text-green-300 italic text-sm">
                            <strong>Explanation:</strong> {q.explanation}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LessonManager;

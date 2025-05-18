"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../../components/loader/Loader";
import API from "../../../utils/api";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

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

  if (loading)
    return (
      <main>
        <Loader />
      </main>
    );

  if (!lesson || lesson.error)
    return <p className="text-center text-red-600 mt-10">Lesson not found.</p>;

  const quiz = lesson.quiz || [];
  const currentQuiz = quiz[currentIndex];

  const handleOptionClick = (option) => {
    if (showAnswer) return; // Prevent changing after answered
    setSelectedOption(option);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <main className="p-6 mx-auto">
      {/* Lesson content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">{lesson.topic}</h1>
        <p className="text-gray-700 leading-relaxed">{lesson.content}</p>
      </motion.div>

      {/* Quiz Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Quiz</h2>

        {quizCompleted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-green-700 text-xl font-semibold"
          >
            🎉 You have completed the quiz! Great job!
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {currentQuiz && (
              <motion.div
                key={currentQuiz._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-8 p-6 border border-gray-300 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-3">
                  Q{currentIndex + 1}: {currentQuiz.question}
                </h3>

                <ul className="space-y-3">
                  {currentQuiz.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === currentQuiz.answer;

                    // Color logic
                    let optionClass =
                      "cursor-pointer rounded-md border px-4 py-2 select-none ";
                    if (showAnswer) {
                      if (isCorrect) {
                        optionClass +=
                          "bg-green-200 border-green-500 text-green-900 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        optionClass +=
                          "bg-red-200 border-red-500 text-red-900 font-semibold line-through";
                      } else {
                        optionClass += "opacity-70 cursor-default";
                      }
                    } else {
                      optionClass +=
                        "hover:bg-blue-100 border-gray-300 text-gray-900";
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

                {/* Show explanation and next button only after answer */}
                {showAnswer && (
                  <>
                    <p className="mt-4 italic text-gray-700">
                      {currentQuiz.explanation}
                    </p>
                    <button
                      onClick={handleNextQuestion}
                      className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {currentIndex + 1 < quiz.length
                        ? "Next Question"
                        : "Finish Quiz"}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}

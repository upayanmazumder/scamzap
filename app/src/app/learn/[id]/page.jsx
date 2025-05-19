"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../../components/loader/Loader";
import API from "../../../utils/api";

export default function LessonDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // For quiz navigation
  const [flatQuestions, setFlatQuestions] = useState([]);
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

        // Flatten all questions from all quizzes into a single array
        if (data && Array.isArray(data.quiz)) {
          const allQuestions = [];
          data.quiz.forEach((quiz, quizIdx) => {
            if (Array.isArray(quiz.questions)) {
              quiz.questions.forEach((q) => {
                allQuestions.push({
                  ...q,
                  quizTopic: quiz.topic,
                  quizIdx,
                });
              });
            }
          });
          setFlatQuestions(allQuestions);
        } else {
          setFlatQuestions([]);
        }
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
        setFlatQuestions([]);
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

  const quizLength = flatQuestions.length;
  const currentQuestion = flatQuestions[currentIndex];

  const handleOptionClick = (option) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    if (currentIndex + 1 < quizLength) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <main>
      {!quizCompleted && (
        <div className="w-full h-4 bg-gray-300 rounded mb-6">
          <div
            className="h-full bg-[var(--theme-green)] transition-all duration-300 rounded"
            style={{
              width: `${
                ((currentIndex + (showAnswer ? 1 : 0)) / quizLength) * 100
              }%`,
            }}
          ></div>
        </div>
      )}

      <div className="px-6 h-[calc(100vh-4rem)] overflow-y-auto">
        <section className="h-full">
          {quizCompleted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[var(--foreground)] text-xl font-semibold flex flex-col items-center gap-6 mt-10 h-full justify-center"
            >
              🎉 You have completed the quiz! Great job!
              <button onClick={() => router.push("/learn")}>Complete</button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id || currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8 h-full w-full flex flex-col justify-center"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">
                      Q{currentIndex + 1}: {currentQuestion.question}
                    </h3>
                    {currentQuestion.quizTopic && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Quiz:</span>{" "}
                        {currentQuestion.quizTopic}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-16">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      const isCorrect = option === currentQuestion.answer;

                      let optionClass =
                        "cursor-pointer rounded-md border px-4 py-2 select-none";
                      if (showAnswer) {
                        if (isCorrect) {
                          optionClass +=
                            " bg-green-200 border-green-500 text-green-900 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          optionClass +=
                            " bg-red-200 border-red-500 text-red-900 font-semibold line-through";
                        } else {
                          optionClass += " opacity-70 cursor-default";
                        }
                      } else {
                        optionClass +=
                          " hover:bg-blue-100 text-[var(--foreground)]";
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

                  {showAnswer && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[30rem] bg-gray-700 shadow-lg border border-gray-300 rounded-2xl px-6 py-4 z-50"
                    >
                      <p className="text-[var(--theme-black)] mb-4">
                        {currentQuestion.explanation}
                      </p>
                      <button onClick={handleNextQuestion} className="w-full">
                        {currentIndex + 1 < quizLength
                          ? "Next Question"
                          : "Finish Quiz"}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>
      </div>
    </main>
  );
}

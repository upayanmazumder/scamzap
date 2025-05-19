"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../../../../components/loader/Loader";
import API from "../../../../../utils/api";
import { useSession } from "next-auth/react";

export default function QuizPage() {
  const { lessonId, quizId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`${API}/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);
        if (Array.isArray(data.quiz)) {
          setQuiz(data.quiz.find(q => String(q._id) === String(quizId)));
        }
      } catch (err) {
        console.error("Failed to fetch lesson/quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    if (lessonId && quizId) fetchLesson();
  }, [lessonId, quizId]);

  if (loading) return <Loader />;
  if (!lesson || !quiz) return <div className="p-8 text-center">Quiz not found.</div>;
  if (!quiz.questions || quiz.questions.length === 0)
    return <div className="p-8 text-center">No questions in this quiz.</div>;

  const questions = quiz.questions;
  const quizLength = questions.length;
  const currentQuestion = questions[currentIndex];

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
    <main className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{lesson.topic} - {quiz.topic}</h2>
      {!quizCompleted && (
        <div className="w-full h-2 bg-gray-200 rounded mb-6">
          <div
            className="h-full bg-green-500 transition-all duration-300 rounded"
            style={{
              width: `${((currentIndex + (showAnswer ? 1 : 0)) / quizLength) * 100}%`,
            }}
          ></div>
        </div>
      )}
      <section>
        {quizCompleted ? (
          <div className="text-center text-xl font-semibold mt-20">
            <p className="mb-6">🎉 Quiz Completed! Well done!</p>
            <button
              onClick={() => router.push("/learn")}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Lessons
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold mb-6">
                Q{currentIndex + 1}: {currentQuestion.question}
              </h3>
              <ul className="space-y-3 mb-6">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQuestion.answer;
                  let optionClass =
                    "cursor-pointer rounded-md border px-4 py-2 select-none transition-all";
                  if (showAnswer) {
                    if (isCorrect) {
                      optionClass += " bg-green-200 border-green-500 text-green-900 font-semibold";
                    } else if (isSelected && !isCorrect) {
                      optionClass += " bg-red-200 border-red-500 text-red-900 font-semibold line-through";
                    } else {
                      optionClass += " opacity-70 cursor-default";
                    }
                  } else {
                    optionClass += " hover:bg-blue-100 text-gray-800";
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
                <div className="mt-4 bg-gray-100 rounded p-4">
                  <p className="mb-2">{currentQuestion.explanation}</p>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {currentIndex < quizLength - 1 ? "Next Question" : "Finish Quiz"}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}

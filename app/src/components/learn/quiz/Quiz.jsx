"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../loader/Loader";
import API from "../../../utils/api";
import { useSession } from "next-auth/react";

export default function QuizPage() {
  const { lessonId, quizId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`${API}/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);
        if (Array.isArray(data.quiz)) {
          setQuiz(data.quiz.find((q) => String(q._id) === String(quizId)));
        }
      } catch (err) {
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };
    if (lessonId && quizId) fetchLesson();
  }, [lessonId, quizId]);

  useEffect(() => {
    const saveProgress = async () => {
      if (
        quizCompleted &&
        session?.user?.sub &&
        lesson &&
        lesson._id &&
        quiz &&
        quiz._id
      ) {
        setSaving(true);
        try {
          await fetch(`${API}/users/${session.user.sub}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lessonId: lesson._id,
              quizzes: [{ quizId: quiz._id, completed: true }],
              completed: false,
              lastAccessed: new Date(),
            }),
          });
        } catch (err) {
        } finally {
          setSaving(false);
        }
      }
    };
    saveProgress();
  }, [quizCompleted]);

  if (loading) return <Loader />;
  if (!lesson || !quiz)
    return <div className="p-8 text-center">Quiz not found.</div>;
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
    <>
      {!quizCompleted && (
        <div className="w-full h-4 bg-gray-300 rounded mb-6">
          <div
            className="h-full bg-green-500 transition-all duration-300 rounded"
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
              className="text-center text-xl font-semibold flex flex-col items-center gap-6 mt-10 h-full justify-center"
            >
              🎉 You have completed the quiz! Great job!
              <button
                onClick={() => router.push("/learn")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Lessons
              </button>
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
                    <h2 className="text-2xl font-semibold mb-2">
                      {lesson.topic} - {quiz.topic}
                    </h2>
                    <h3 className="text-xl font-semibold mb-3">
                      Q{currentIndex + 1}: {currentQuestion.question}
                    </h3>
                  </div>

                  <ul className="space-y-3 mb-16">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      const isCorrect = option === currentQuestion.answer;

                      let optionClass =
                        "cursor-pointer rounded-md border px-4 py-2 select-none bg-gray-800 text-white transition-colors duration-200";
                      if (showAnswer) {
                        if (isCorrect) {
                          optionClass +=
                            " bg-green-800 border-green-500 text-green-900 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          optionClass +=
                            " bg-red-800 border-red-500 text-red-900 font-semibold line-through";
                        } else {
                          optionClass += " opacity-70 cursor-default";
                        }
                      } else {
                        optionClass += "";
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
                      <p className="text-white mb-4">
                        {currentQuestion.explanation}
                      </p>
                      <button
                        onClick={handleNextQuestion}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
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
    </>
  );
}

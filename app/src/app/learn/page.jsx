"use client";

import { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";
import API from "../../utils/api";
import { motion } from "framer-motion";
import { FaBookOpen, FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LearnJourney() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

        console.log("Lessons data:", lessonsData);
        console.log("Progress data:", progressData);

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

  const getQuizProgress = (lessonId, quizId) => {
    const lessonProgress = getLessonProgress(lessonId);
    if (!lessonProgress) return null;
    return lessonProgress.quizzes.find((q) => q.quizId === quizId);
  };

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
      <div>
        {lessons.map((lesson) => {
          const lessonProgress = getLessonProgress(lesson._id);
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
            <section
              key={lesson._id}
              className="mb-20 flex flex-col items-center w-full"
            >
              <div
  className="sticky top-6 z-20 bg-[#F89C3B] border border-blue-100 shadow-md rounded-2xl px-6 py-4 mb-0 grid grid-cols-1 gap-2 text-center w-full mx-auto"
>
  {/* Title row */}
  <h1 className="text-xl font-semibold flex justify-center items-center gap-2 text-gray-700]"
  style={{
    color: "#164A78",
  }}
  >
     {lesson.topic}
  </h1>

  {/* Info row with 2 columns */}
  <div className="grid grid-cols-2 gap-2 text-md text-[#164A78]">
    <span>
      {lesson.quiz.length} quiz{lesson.quiz.length > 1 ? "zes" : ""}
    </span>


    {lesson.quiz.length > 0 && (
      <span>{progressPercent}% done</span>
    )}
  </div>
</div>


              {/* Timeline */}
              <div className="relative w-full max-w-3xl mx-auto py-12">
                {/* Vertical line - stretches full height */}
                <div className="absolute left-1/2 top-[130px] bottom-[130px] w-1 bg-blue-200 -translate-x-1/2 z-0"></div>
                <div className="flex flex-col gap-20">
                  {lesson.quiz.map((quiz, quizIdx) => {
                    const quizProgress = getQuizProgress(lesson._id, quiz._id);
                    console.log("Quiz progress:", quizProgress);
                    const isLeft = quizIdx % 2 === 0;
                    return (
                      <div
                        key={quiz._id}
                        className="relative flex items-center min-h-[140px]"
                      >
                        {/* Connector line above circle (except first) */}
                        {quizIdx !== 0 && (
                          <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-1 h-20 bg-blue-200 z-0"></div>
                        )}
                        {/* Left side */}
                        <div className={`w-1/2 flex ${isLeft ? "justify-end mr-24" : "justify-end"}`}>
                          {isLeft && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.97 }}
                                className={`
                                  w-20 h-20 rounded-full flex items-center justify-center
                                  shadow-lg border-2 transition-all
                                  relative z-10
                                  
                                `}
                                style={{
                                  backgroundColor: quizProgress?.completed
                                    ? "#2ECC71"
                                    : "#F89C3B",
                                }}
                                onClick={() =>
                                  router.push(`/learn/${lesson._id}/quiz/${quiz._id}`)
                                }
                              >
                                <FaStar
                                  className="text-[#164A78]"
                                  style={{ width: "120px", height: "120px" }}
                                />
                              </motion.button>
                              {/* horizontal line connecting to center */}
                              <div className="absolute right-1/2 w-24 h-1 bg-blue-200 top-1/2 -translate-y-1/2 z-0" />
                            </>
                          )}
                        </div>
                        {/* Timeline dot */}
                        <div className="absolute left-1/2 -translate-x-1/2 z-10">
                          <div className="w-8 h-8 rounded-full bg-blue-400 border-4 border-white shadow-md"></div>
                        </div>
                        {/* Right side */}
                        <div className={`w-1/2 flex ${!isLeft ? "justify-start ml-24" : "justify-start"}`}>
                          {!isLeft && (
                            <>
                              {/* horizontal line connecting to center */}
                              <div className="absolute left-1/2 w-24 h-1 bg-blue-200 top-1/2 -translate-y-1/2 z-0" />
                              <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.97 }}
                                className={`
                                  w-20 h-20 rounded-full flex items-center justify-center
                                  shadow-lg border-2 transition-all
                                  relative z-10
                                  
                                `}
                                style={{
                                  backgroundColor: quizProgress?.completed
                                    ? "#2ECC71"
                                    : "#F89C3B",
                                }}
                                onClick={() =>
                                  router.push(`/learn/${lesson._id}/quiz/${quiz._id}`)
                                }
                              >
                                <FaStar
                                  className="text-[#164A78]"
                                  style={{ width: "120px", height: "120px" }}
                                />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

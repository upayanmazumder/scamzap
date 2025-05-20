import Quiz from "../../../../../components/learn/quiz/Quiz";

export default function QuizPage({ params }) {
  const { lessonId, quizId } = params;

  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      <Quiz lessonId={lessonId} quizId={quizId} />
    </main>
  );
}

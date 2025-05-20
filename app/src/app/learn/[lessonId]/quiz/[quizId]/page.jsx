import Quiz from "../../../../../components/learn/quiz/Quiz";

export default function QuizPage({ params }) {
  const { lessonId, quizId } = params;

  return (
    <main>
      <Quiz lessonId={lessonId} quizId={quizId} />
    </main>
  );
}

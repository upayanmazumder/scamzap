import LessonDetail from "../../../components/learn/lessondetail/LessonDetail";

export default function LessonPage({ params }) {
  const { lessonId } = params;
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="page-header">
        <h1>Lesson {lessonId}</h1>
        <p>Learn the basics of programming with our interactive lessons.</p>
      </div>
      <LessonDetail lessonId={lessonId} />
    </main>
  );
}

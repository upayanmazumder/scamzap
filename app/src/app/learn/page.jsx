import Lesson from "../../components/learn/lesson/Lesson";

export default function LearnPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
      <div className="page-header">
        <h1>Learn</h1>
        <p>Stay safe from scams with our interactive lessons.</p>
      </div>
      <Lesson />
    </main>
  );
}

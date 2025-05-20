import Lesson from "../../components/lesson/Lesson";

export default function LearnPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
      <div class="page-header">
        <h1>Learn</h1>
        <p>Learn the basics of programming with our interactive lessons.</p>
      </div>
      <Lesson />
    </main>
  );
}

import Scams from "../../components/scams/Scams";

export default function FeedPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
      <div className="page-header">
        <h1>Recent Scams</h1>
        <p>Stay updated with the latest scams reported by users.</p>
      </div>
      <Scams />
    </main>
  );
}

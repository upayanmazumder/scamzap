import Scams from "../../components/scams/Scams";

export default function FeedPage() {
  return (
    <main>
      <div className="page-header">
        <h1>Recent Scams</h1>
        <p>Stay updated with the latest scams reported by users.</p>
      </div>
      <Scams />
    </main>
  );
}

import Scams from "../../components/scams/Scams";

export default function FeedPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center pt-6">
        <h1>Recent Scams</h1>
      </div>
      <Scams />
    </div>
  );
}

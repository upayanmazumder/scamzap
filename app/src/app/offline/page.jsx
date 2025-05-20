import Offline from "../../components/offline/Offline";

export default function OfflinePage() {
  return (
    <main>
      <div className="page-header">
        <h1>Offline</h1>
        <p>It seems you are offline. Please check your internet connection.</p>
      </div>
      <Offline />
    </main>
  );
}

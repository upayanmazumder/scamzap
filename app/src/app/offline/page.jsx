import Offline from "../../components/offline/Offline";

export default function OfflinePage() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full">
      <div className="page-header">
        <h1>Offline</h1>
        <p>It seems you are offline. Please check your internet connection.</p>
      </div>
      <Offline />
    </main>
  );
}

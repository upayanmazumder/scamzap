"use client";

import { useSession } from "next-auth/react";
import ScamUploadForm from "../../components/ScamUploadForm/ScamUploadForm";

export default function ReportPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You must be signed in to report a scam.</p>;

  const userId = session?.user?.sub;

  return (
    <div className="min-h-screen  p-6 flex items-center justify-center">
      {userId ? (
        <ScamUploadForm userId={userId} />
      ) : (
        <p className="text-red-500">User ID not available</p>
      )}
    </div>
  );
}

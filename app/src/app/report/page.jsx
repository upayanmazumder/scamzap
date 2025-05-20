"use client";

import { useSession } from "next-auth/react";
import ScamUploadForm from "../../components/scams/scamuploadform/ScamUploadForm";

export default function ReportPage() {
  const { data: session } = useSession();

  const userId = session?.user?.sub;

  return (
    <main>
      <div className="page-header">
        <h1>Report a Scam</h1>
        <p>Help us keep the community safe by reporting scams.</p>
      </div>
      <ScamUploadForm userId={userId} />
    </main>
  );
}

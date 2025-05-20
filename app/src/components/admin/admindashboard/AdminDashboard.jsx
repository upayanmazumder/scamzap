"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserRoleManager from "./userrolemanager/UserRoleManager";
import LessonManager from "./lessonmanager/LessonManager";
import API from "../../../utils/api";
import Loader from "../../loader/Loader";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.sub) {
      router.replace("/learn");
      return;
    }
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${API}/admin/role/${session.user.sub}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.role !== "admin") {
          router.replace("/learn");
        } else {
          setLoading(false);
        }
      } catch {
        router.replace("/learn");
      }
    };
    checkAdmin();
  }, [session, status, router]);

  if (loading || status === "loading") return <Loader />;

  return (
    <>
      <div className="tabs">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          User Roles
        </button>
        <button
          className={activeTab === "lessons" ? "active" : ""}
          onClick={() => setActiveTab("lessons")}
        >
          Lessons
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "users" && <UserRoleManager />}
        {activeTab === "lessons" && <LessonManager />}
      </div>

      <style jsx>{`
        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        button {
          padding: 0.5rem 1rem;
          border: none;
          background: #1e5377;
          cursor: pointer;
          border-radius: 4px;
          font-weight: 600;
        }
        button.active {
          background: #0070f3;
          color: white;
        }
        button:hover:not(.active) {
          background: #3188c3;
        }
      `}</style>
    </>
  );
}

"use client";

import { useState } from "react";
import UserRoleManager from "../../components/admin/userrolemanager/UserRoleManager";
import LessonManager from "../../components/admin/lessonmanager/LessonManager.jsx";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <main>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and content</p>
      </div>

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
    </main>
  );
}

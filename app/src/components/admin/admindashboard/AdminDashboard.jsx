"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserRoleManager from "./userrolemanager/UserRoleManager";
import LessonManager from "./lessonmanager/LessonManager";
import API from "../../../utils/api";
import Loader from "../../loader/Loader";
import styles from "./AdminDashboard.module.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.sub || !session?.accessToken) {
      router.replace("/learn");
      return;
    }

    const checkAdmin = async () => {
      try {
        const res = await fetch(`${API}/admin/role/${session.user.sub}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        if (!res.ok) throw new Error("Failed to verify admin role");
        const data = await res.json();
        if (data.role !== "admin") {
          router.replace("/learn");
        } else {
          setLoading(false);
        }
      } catch (err) {
        router.replace("/learn");
      }
    };

    checkAdmin();
  }, [session, status, router]);

  if (loading || status === "loading") return <Loader />;

  return (
    <>
      <div className={styles.tabs} style={{ display: "flex", gap: "1rem" }}>
        <button
          className={activeTab === "users" ? styles.active : ""}
          onClick={() => setActiveTab("users")}
        >
          User Roles
        </button>
        <button
          className={activeTab === "lessons" ? styles.active : ""}
          onClick={() => setActiveTab("lessons")}
        >
          Lessons
        </button>
      </div>

      <div className={styles["tab-content"]}>
        {activeTab === "users" && <UserRoleManager />}
        {activeTab === "lessons" && <LessonManager />}
      </div>
    </>
  );
}

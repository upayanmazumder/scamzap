"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/api";
import Loader from "../../loader/Loader";

export default function Redirect() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.sub &&
      session?.accessToken
    ) {
      const fetchRole = async () => {
        try {
          const res = await fetch(`${API}/admin/role/${session.user.sub}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch role");
          const data = await res.json();
          setRole(data.role);
        } catch (error) {
          console.error("Error fetching role:", error);
          setRole(null);
        } finally {
          setLoading(false);
        }
      };
      fetchRole();
    } else if (status !== "loading") {
      setRole(null);
      setLoading(false);
    }
  }, [session, status]);

  if (loading) return <Loader />;

  if (!session) return null;

  return (
    <>
      {role === "admin" && (
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 9999,
            cursor: "pointer",
          }}
          onClick={() => router.push("/admin")}
          title="Go to Admin Panel"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") router.push("/admin");
          }}
        >
          <img
            src="/icon.svg"
            alt="Admin Logo"
            style={{ width: 40, height: 40 }}
          />
        </div>
      )}
    </>
  );
}

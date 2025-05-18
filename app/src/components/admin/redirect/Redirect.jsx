"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/api";

export default function Redirect() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.sub) {
      const fetchRole = async () => {
        try {
          const res = await fetch(`${API}/admin/role/${session.user.sub}`);
          if (!res.ok) throw new Error("Failed to fetch role");
          const data = await res.json();
          setRole(data.role);
        } catch (error) {
          console.error(error);
          setRole(null);
        } finally {
          setLoading(false);
        }
      };
      fetchRole();
    } else if (status !== "loading") {
      setLoading(false);
      setRole(null);
    }
  }, [session, status]);

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return null;
  }

  return (
    <div>
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
        >
          <img
            src="/icon.svg"
            alt="Admin Logo"
            style={{ width: 40, height: 40 }}
          />
        </div>
      )}
    </div>
  );
}

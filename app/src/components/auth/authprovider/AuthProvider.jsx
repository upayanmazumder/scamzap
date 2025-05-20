"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import API from "../../../utils/api";

function SyncUser() {
  const { data: session } = useSession();

  useEffect(() => {
    const syncUser = async () => {
      if (!session?.user?.email) return;

      try {
        const token = session?.accessToken;

        if (!token) {
          console.error("No JWT token found in session");
          return;
        }

        sessionStorage.setItem("authToken", token);

        const res = await fetch(`${API}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: session.user.sub,
            name: session.user.name,
            email: session.user.email,
          }),
        });

        if (res.status === 401) {
          console.warn("Token expired or unauthorized, signing out...");
          signOut({ callbackUrl: "/" });
          return;
        }

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to sync user: ${errText}`);
        }

        console.log("User synced in AuthProvider");
      } catch (err) {
        console.error("User sync failed:", err);
        if (
          err.message.toLowerCase().includes("unauthorized") ||
          err.message.toLowerCase().includes("token")
        ) {
          signOut({ callbackUrl: "/" });
        }
      }
    };

    syncUser();
  }, [session]);

  return null;
}

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <SyncUser />
      {children}
    </SessionProvider>
  );
}

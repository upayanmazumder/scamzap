"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import API from "../../../utils/api";

function SyncUser() {
  const { data: session } = useSession();

  useEffect(() => {
    const syncUser = async () => {
      if (!session?.user?.email) return;

      try {
        const token = session?.accessToken;

        if (token) {
          sessionStorage.setItem("authToken", token);
        } else {
          console.error("No JWT token found in session");
          return;
        }

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

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to sync user: ${errText}`);
        }

        console.log("User synced in AuthProvider");
      } catch (err) {
        console.error("User sync failed:", err);
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

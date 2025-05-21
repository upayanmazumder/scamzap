"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import API from "../../../utils/api";

function SyncUser() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    const syncUser = async () => {
      const token = session?.accessToken;

      if (!token) {
        console.error("No JWT token found in session");
        signOut({ callbackUrl: "/" });
        return;
      }

      sessionStorage.setItem("authToken", token);

      try {
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
          console.warn("Unauthorized. Signing out...");
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
        signOut({ callbackUrl: "/" });
      }
    };

    syncUser();
  }, [session, status]);

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

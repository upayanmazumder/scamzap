"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Authenticate from "../authenticate/Authenticate";
import Loader from "../../loader/Loader";

const PROTECTED_PATHS = [
  "/learn",
  "/admin",
  "/feed",
  "/profile",
  "/report",
  "/search",
];

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) return children;

  if (status === "loading") {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Loader />
      </main>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div className="page-header">
          <h1>Welcome to Scamzap</h1>
          <p>
            To access this page, please log in or create an account. Your
            security is our priority.
          </p>
        </div>
        <Authenticate />
        <span style={{ margin: "1rem 0" }}>or</span>
        <button
          style={{
            backgroundColor: "transparent",
            padding: 0,
            fontSize: "1.5em",
            cursor: "pointer",
            border: "none",
            color: "#0070f3",
            textDecoration: "underline",
          }}
          onClick={() => (window.location.href = "/")}
        >
          Go to Home
        </button>
      </main>
    );
  }

  return children;
}

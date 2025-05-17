"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { FaGoogle, FaSignOutAlt } from "react-icons/fa";
import md5 from "md5";
import API from "../../../utils/api";
import { useEffect } from "react";

function getGravatarUrl(email, size = 64) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

export default function Authenticate() {
  const { data: session } = useSession();

  useEffect(() => {
    const registerUser = async () => {
      if (session?.user?.email) {
        try {
          await fetch(`${API}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: session.user.name,
              email: session.user.email,
            }),
          });
        } catch (err) {
          console.error("User registration failed:", err);
        }
      }
    };
    registerUser();
  }, [session?.user?.email]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {session ? (
        <div className="flex items-center gap-2 p-2 sm:p-4 bg-gray-800 rounded-lg w-full max-w-xs sm:max-w-sm">
          <img
            src={getGravatarUrl(session.user.email)}
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-600"
          />
          <span className="text-gray-200 text-sm truncate flex-1">
            <span className="font-semibold">{session.user.name}</span>
          </span>
          <button
            onClick={() => signOut()}
            className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-red-600 text-xs sm:text-sm text-white rounded hover:bg-red-700 transition"
            title="Sign out"
          >
            <FaSignOutAlt className="mr-1" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="flex items-center px-3 py-1.5 sm:px-5 sm:py-2.5 bg-blue-700 text-xs sm:text-base text-white rounded hover:bg-blue-800 transition w-full max-w-xs sm:max-w-sm justify-center"
        >
          <FaGoogle className="mr-2" />
          <span className="truncate">Sign in with Google</span>
        </button>
      )}
    </div>
  );
}

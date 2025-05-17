"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { FaGoogle, FaSignOutAlt } from "react-icons/fa";
import md5 from "md5";
import API from "../../../utils/api";
import { useEffect } from "react";

function getGravatarUrl(email, size = 128) {
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
            headers: {
              "Content-Type": "application/json",
            },
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
    <div className="flex flex-col items-center justify-center ">
      {session ? (
        <div className="flex items-center space-x-4 p-6 bg-gray-900 rounded-lg shadow-lg">
          <img
            src={getGravatarUrl(session.user.email)}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-700"
          />
          <span className="text-gray-200">
            <span className="font-semibold">{session.user.email}</span>
          </span>
          <button
            onClick={() => signOut()}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <FaSignOutAlt className="mr-2" />
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="flex items-center px-5 py-2.5 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
        >
          <FaGoogle className="mr-2" />
          Sign in with Google
        </button>
      )}
    </div>
  );
}

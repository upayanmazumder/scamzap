"use client";

import { useSession, signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function Authenticate() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {session ? (
        <div
          className="flex items-center gap-2 p-2 sm:p-2 rounded-lg w-full max-w-xs sm:max-w-sm cursor-pointer"
          onClick={() => (window.location.href = "/profile")}
        >
          <img
            src={session.user.image ?? ""}
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-600"
          />
          <span className="text-gray-200 text-sm truncate flex-1">
            <span className="font-semibold">{session.user.name}</span>
          </span>
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

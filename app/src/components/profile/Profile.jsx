"use client";

import { useSession, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-700 mb-4">You are not signed in.</p>
      </div>
    );
  }

  const { name, email, image, sub } = session.user || {};

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <img
        src={image || "/default-avatar.png"}
        alt={`${name || "User"}'s profile picture`}
        className="w-24 h-24 rounded-full mb-4 border border-gray-300 object-cover"
        loading="lazy"
      />
      <h2 className="text-2xl font-semibold mb-1">
        {name || "Anonymous User"}
      </h2>
      {email && <p className="text-gray-600 mb-2">{email}</p>}
      {sub && (
        <p className="text-sm text-gray-500 mb-6">
          User ID: <strong>{sub}</strong>
        </p>
      )}
      <button
        onClick={() => signOut()}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
      >
        Log out
      </button>
    </div>
  );
}

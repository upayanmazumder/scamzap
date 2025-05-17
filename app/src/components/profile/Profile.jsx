"use client";

import { useSession, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-700 mb-4">You are not signed in.</p>
      </div>
    );
  }

  const { name, email } = session.user;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] ">
      <img
        src={session.user.image}
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4"
        loading="lazy"
      />
      <h2 className="text-2xl font-bold mb-1">{name}</h2>
      <p className="text-gray-600 mb-6">{email}</p>
      <button
        onClick={() => signOut()}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Log out
      </button>
    </div>
  );
}

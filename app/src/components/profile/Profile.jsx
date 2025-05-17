"use client";

import { useSession, signOut } from "next-auth/react";
import md5 from "md5";

function getGravatarUrl(email, size = 96) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-900">
      <img
        src={getGravatarUrl(email)}
        alt="Profile"
        className="w-24 h-24 rounded-fullmb-4"
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

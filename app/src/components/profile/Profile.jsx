"use client";

import { useSession, signOut } from "next-auth/react";
import Loader from "../loader/Loader";
import React, { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import API from "../../utils/api";

export default function Profile() {
  const { data: session, status } = useSession();

  const [createdAt, setCreatedAt] = useState(null);
  const [loadingCreatedAt, setLoadingCreatedAt] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.sub) {
      const userId = session.user.sub;

      setLoadingCreatedAt(true);
      setError(null);

      fetch(`${API}/users/${userId}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Error fetching user: ${res.statusText}`);
          }
          const data = await res.json();
          setCreatedAt(data.createdAt);
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch user data");
          setCreatedAt(null);
        })
        .finally(() => setLoadingCreatedAt(false));
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader />
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
      {image ? (
        <img
          src={image}
          alt={`${name || "User"}'s profile picture`}
          className="w-24 h-24 rounded-full mb-4 border border-gray-300 object-cover"
          loading="lazy"
        />
      ) : (
        <FaUserCircle className="w-24 h-24 mb-4 text-gray-400" />
      )}
      <h2 className="text-2xl font-semibold mb-1">
        {name || "Anonymous User"}
      </h2>
      {email && <p className="text-gray-600 mb-2">{email}</p>}
      {sub && (
        <p className="text-sm text-gray-500 mb-2">
          User ID: <strong>{sub}</strong>
        </p>
      )}

      {loadingCreatedAt && (
        <p className="text-gray-500 mb-2">Loading creation date...</p>
      )}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {createdAt && !loadingCreatedAt && !error && (
        <p className="text-gray-700 mb-6">
          Account created on:{" "}
          <strong>
            {new Date(createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </strong>
        </p>
      )}

      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
      >
        <FaSignOutAlt />
        Log out
      </button>
    </div>
  );
}

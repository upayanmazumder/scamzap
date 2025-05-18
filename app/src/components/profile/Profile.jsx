"use client";

import { useSession, signOut } from "next-auth/react";
import Loader from "../loader/Loader";
import React, { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaPencilAlt } from "react-icons/fa";
import API from "../../utils/api";

export default function Profile() {
  const { data: session, status } = useSession();
  const [createdAt, setCreatedAt] = useState(null);
  const [loadingCreatedAt, setLoadingCreatedAt] = useState(false);
  const [error, setError] = useState(null);
  const [followingCount, setFollowingCount] = useState(3); // Example data
  const [followersCount, setFollowersCount] = useState(5); // Example data

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
      <div className="flex flex-col items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center text-white">
        <p className="text-lg mb-4">You are not signed in.</p>
      </div>
    );
  }

  const { name, image } = session.user || {};
  const joinedDateFull = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const joinedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <div className="py-8 flex flex-col items-center">
      <div className="bg-orange-400 rounded-md relative overflow-hidden shadow-md w-full max-w-md">
        <div className="absolute top-2 right-2 text-gray-700 cursor-pointer">
          <FaPencilAlt />
        </div>
        <div className="flex justify-center p-6">
          {image ? (
            <img
              src={image}
              alt={`${name || "User"}'s profile picture`}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm"
              loading="lazy"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-white bg-gray-400 rounded-full shadow-sm" />
          )}
        </div>
      </div>

      <div className="mt-6 text-white text-center w-full max-w-md">
        <h2 className="text-3xl font-semibold">{name || "Anonymous"}</h2>
        <p
          className="text-lg text-blue-200 cursor-help"
          title={`Joined at ${joinedTime}`}
        >
          Joined {joinedDateFull}
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <p>
            <strong className="font-semibold">{followingCount}</strong>{" "}
            Following
          </p>
          <p>
            <strong className="font-semibold">{followersCount}</strong>{" "}
            Followers
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 shadow-md mt-4"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

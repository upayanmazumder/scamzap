"use client";

import { useSession, signOut } from "next-auth/react";
import Loader from "../loader/Loader";
import React, { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaShareAlt } from "react-icons/fa";
import API from "../../utils/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const [createdAt, setCreatedAt] = useState(null);
  const [loadingCreatedAt, setLoadingCreatedAt] = useState(false);
  const [error, setError] = useState(null);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

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
          setFollowersCount(data.followers?.length || 0);
          setFollowingCount(data.following?.length || 0);
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch user data");
          setCreatedAt(null);
        })
        .finally(() => setLoadingCreatedAt(false));
    }
  }, [status, session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [status, router]);

  const handleShare = () => {
    if (session?.user?.sub) {
      const url = `${window.location.origin}/users/${session.user.sub}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 10000);
      });
    }
  };

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
        <p className="text-sm text-gray-300">Redirecting to home...</p>
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
    <motion.div
      className="py-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="bg-orange-400 rounded-[40px] relative overflow-hidden shadow-md w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-center p-6">
          {image ? (
            <motion.img
              src={image}
              alt={`${name || "User"}'s profile picture`}
              className="w-24 h-24 object-cover "
              loading="lazy"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            />
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <FaUserCircle className="w-24 h-24 text-white bg-gray-400 rounded-full shadow-sm" />
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="mt-6 text-white text-center w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-3xl font-semibold">{name || "Anonymous"}</h2>
        <p
          className="text-lg text-blue-200 cursor-help"
          title={`Joined at ${joinedTime}`}
        >
          Joined {joinedDateFull}
        </p>
        <motion.div
          className="flex items-center justify-center gap-4 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <p>
            <strong className="font-semibold">{followingCount}</strong>{" "}
            Following
          </p>
          <p>
            <strong className="font-semibold">{followersCount}</strong>{" "}
            Followers
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
            disabled={copySuccess}
          >
            <FaShareAlt />
            {copySuccess ? "Copied" : "Share Profile"}
          </button>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 shadow-md"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

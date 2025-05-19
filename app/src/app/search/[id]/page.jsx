"use client";

import API from "../../../utils/api";
import Loader from "../../../components/loader/Loader";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaEnvelope, FaShareAlt, FaSignOutAlt } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";

export default function User() {
  const { id } = useParams();
  const { data: session } = useSession();
  const currentUserId = session?.user?.sub;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${id}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);

      if (currentUserId && currentUserId !== id) {
        const resFollowing = await fetch(`${API}/users/following/${id}`);
        if (!resFollowing.ok) throw new Error("Failed to fetch following");
        const followingList = await resFollowing.json();
        setIsFollowing(followingList.some((u) => u.id === id));
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  }, [id, currentUserId]);

  useEffect(() => {
    if (id) fetchUser();
  }, [id, fetchUser]);

  const handleFollowToggle = async () => {
    if (!currentUserId) return alert("Please log in to follow users");

    setProcessing(true);
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await fetch(`${API}/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, targetId: id }),
      });

      if (!res.ok) throw new Error(await res.text());

      setIsFollowing(!isFollowing);

      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followers: isFollowing
            ? prev.followers?.filter((f) => f !== currentUserId)
            : [...(prev.followers || []), currentUserId],
        };
      });
    } catch (err) {
      console.error(`Failed to ${isFollowing ? "unfollow" : "follow"} user:`, err);
      alert(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
  <main className="flex flex-col items-center justify-center py-10 px-4 min-h-screen">
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader />
        </motion.div>
      ) : !user || user.error ? (
        <motion.p
          key="error"
          className="text-center text-red-600 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          User not found.
        </motion.p>
      ) : (
        <motion.div
          key="profile"
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="relative overflow-hidden w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-center">
              {user.image ? (
                <motion.img
                  src={user.image}
                  alt={`${user.name}'s profile picture`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
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
            className="mt-6 text-center w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            
            <p className="text-md mt-2 text-gray-700">
              <strong>{user.followers?.length ?? 0}</strong> Followers •{" "}
              <strong>{user.following?.length ?? 0}</strong> Following
            </p>

            {currentUserId && currentUserId !== id && (
              <motion.div
                className="flex justify-center mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <button
                  disabled={processing}
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-md text-white font-semibold shadow-md transition duration-200 ${
                    isFollowing
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {processing
                    ? "Processing..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </main>
);
}
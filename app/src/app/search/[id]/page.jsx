"use client";

import API from "../../../utils/api";
import Loader from "../../../components/loader/Loader";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import { useSession } from "next-auth/react";

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
        const resFollowing = await fetch(
          `${API}/users/following/${currentUserId}`
        );
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
    if (id) {
      fetchUser();
    }
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

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setIsFollowing(!isFollowing);

      setUser((prev) => {
        if (!prev) return prev;
        const followersCount = prev.followers?.length ?? 0;
        return {
          ...prev,
          followers: isFollowing
            ? prev.followers?.filter((f) => f !== currentUserId)
            : [...(prev.followers || []), currentUserId],
        };
      });
    } catch (err) {
      console.error(
        `Failed to ${isFollowing ? "unfollow" : "follow"} user:`,
        err
      );
      alert(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="page-header">
              <h1>User Profile</h1>
              <p>User details of {user.name}</p>
            </div>
            <div className="mb-8 mt-6 bg-orange-400 p-4 rounded-md shadow-md">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <FaUserCircle className="text-2xl" />
                {user.name}
              </h1>
              <p className="text-[var(--foreground)] flex items-center gap-2">
                <FaEnvelope className="text-lg" />
                {user.email}
              </p>
              <div className="flex space-x-6 mt-4 text-[var(--foreground)] font-semibold">
                <span>Followers: {user.followers?.length ?? 0}</span>
                <span>Following: {user.following?.length ?? 0}</span>
              </div>
              {currentUserId && currentUserId !== id && (
                <button
                  disabled={processing}
                  onClick={handleFollowToggle}
                  className={`mt-6 px-4 py-2 rounded-md font-semibold transition ${
                    isFollowing
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                >
                  {processing
                    ? "Processing..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

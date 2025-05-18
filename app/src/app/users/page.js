"use client";

import API from "../../utils/api";
import Loader from "../../components/loader/Loader";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Users() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.sub;

  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const fetchUsersAndFollowing = async () => {
      try {
        const resUsers = await fetch(`${API}/users`);
        const dataUsers = await resUsers.json();

        const resFollowing = await fetch(
          `${API}/users/following/${currentUserId}`
        );
        const dataFollowing = await resFollowing.json();

        setUsers(dataUsers);
        setFollowing(dataFollowing.map((user) => user.id));
      } catch (err) {
        console.error("Failed to fetch users or following:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchUsersAndFollowing();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  const handleFollowToggle = async (targetId, isFollowing) => {
    if (!currentUserId) return alert("Please log in to follow users");

    setProcessing(targetId);
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await fetch(`${API}/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, targetId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setFollowing((prev) =>
        isFollowing ? prev.filter((id) => id !== targetId) : [...prev, targetId]
      );
    } catch (err) {
      console.error(
        `Failed to ${isFollowing ? "unfollow" : "follow"} user:`,
        err
      );
      alert(`Error: ${err.message}`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading)
    return (
      <main>
        <Loader />
      </main>
    );

  return (
    <main>
      <div className="page-header">
        <h1>Users</h1>
        <p>List of registered users.</p>
      </div>
      <ul className="space-y-4">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          const isFollowing = following.includes(user.id);

          return (
            <li
              key={user._id}
              className="border p-4 rounded-md flex justify-between items-center transition"
            >
              <Link href={`/users/${user.id}`} className="block flex-grow">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <div className="text-sm text-gray-300 mt-1 flex space-x-4">
                  <span>Followers: {user.followers?.length ?? 0}</span>
                  <span>Following: {user.following?.length ?? 0}</span>
                </div>
              </Link>

              {!isCurrentUser && (
                <button
                  disabled={processing === user.id}
                  onClick={() => handleFollowToggle(user.id, isFollowing)}
                  className={`ml-4 px-4 py-2 rounded-md font-semibold transition ${
                    isFollowing
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {processing === user.id
                    ? "Processing..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

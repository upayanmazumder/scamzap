"use client";

import API from "../../../utils/api";
import Loader from "../../loader/Loader";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const normalize = (str) => str.toLowerCase().trim();

  const filteredUsers = users
    .filter((user) => normalize(user.name).includes(normalize(searchQuery)))
    .sort((a, b) => {
      const query = normalize(searchQuery);
      const nameA = normalize(a.name);
      const nameB = normalize(b.name);

      const aStarts = nameA.startsWith(query);
      const bStarts = nameB.startsWith(query);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return nameA.localeCompare(nameB);
    });

  if (loading) return <Loader />;

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6 px-4 py-2 rounded-md border border-gray-400 text-black w-full"
        />

        <ul className="space-y-4 w-full">
          {filteredUsers.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const isFollowing = following.includes(user.id);

            return (
              <li
                key={user.id}
                className="border rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 transition bg-gray-800 hover:shadow-md hover:bg-gray-700 w-full"
                style={{ borderColor: "var(--foreground)" }}
              >
                <Link href={`/search/${user.id}`} className="flex-1 block">
                  <h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">
                    {user.name}
                  </h2>
                  <div className="text-sm text-[var(--foreground)] mt-1 flex space-x-4 flex-wrap">
                    <span>Followers: {user.followers?.length ?? 0}</span>
                    <span>Following: {user.following?.length ?? 0}</span>
                  </div>
                </Link>

                {!isCurrentUser && (
                  <button
                    disabled={processing === user.id}
                    onClick={() => handleFollowToggle(user.id, isFollowing)}
                    className={`px-4 py-2 w-full sm:w-auto font-semibold transition text-white rounded-none ${
                      isFollowing
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    style={{
                      borderRadius: "0.375rem",
                    }}
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
      </div>
    </>
  );
}

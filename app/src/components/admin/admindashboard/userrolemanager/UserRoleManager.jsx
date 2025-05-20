"use client";

import { useEffect, useState } from "react";
import API from "../../../../utils/api";
import { useSession } from "next-auth/react";
import Loader from "../../../loader/Loader";

export default function UserRoleManager() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentAdminId = session?.user?.sub;

  const fetchUsers = async () => {
    if (!currentAdminId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/users?userId=${currentAdminId}`);
      const data = await res.json();
      // Exclude self
      setUsers(data.filter((user) => user.id !== currentAdminId));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, action) => {
    setMessage("");
    try {
      const res = await fetch(
        `${API}/admin/${action}/${id}?userId=${currentAdminId}`,
        {
          method: "POST",
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");
      setMessage(result.message);
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  return (
    <div className="p-4 max-w-3xl mx-auto h-screen">
      <h2 className="text-2xl font-bold mb-4">User Role Manager</h2>

      <div className="overflow-y-auto max-h-[calc(100vh-6rem)] space-y-4 pr-2">
        {loading ? (
          <Loader />
        ) : users.length === 0 ? (
          <p>No other users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </div>
              {user.role === "admin" ? (
                <button
                  onClick={() => changeRole(user.id, "demote")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Demote
                </button>
              ) : (
                <button
                  onClick={() => changeRole(user.id, "promote")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Promote
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}

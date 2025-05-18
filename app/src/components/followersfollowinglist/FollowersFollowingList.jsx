// components/profile/FollowersFollowingList.jsx
"use client";

import React, { useEffect, useState } from "react";
import API from "../../utils/api";

export default function FollowersFollowingList({ userId, type }) {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && userId) {
      fetch(`${API}/users/${type}/${userId}`)
        .then((res) => res.json())
        .then((data) => setList(data))
        .catch(() => setList([]));
    }
  }, [open, userId, type]);

  return (
    <div className="text-center mt-2">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-blue-100 hover:underline"
      >
        {open ? `Hide ${type}` : `View ${type}`}
      </button>
      {open && (
        <ul className="mt-2 bg-white text-black rounded-md p-2 max-h-48 overflow-y-auto">
          {list.length === 0 ? (
            <li>No {type}</li>
          ) : (
            list.map((user) => (
              <li key={user.id} className="py-1 border-b last:border-none">
                <span className="font-medium">{user.name}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

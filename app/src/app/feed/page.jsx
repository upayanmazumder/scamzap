"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flag } from "lucide-react"; // You can replace with any icon library
import API from "../../utils/api";
import Loader from "../../components/loader/Loader";

export default function ScamFeed() {
  const [scams, setScams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/scams`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load scams");
        return res.json();
      })
      .then((data) => {
        // Sort by newest first
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setScams(sorted);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] relative">

      {/* Fixed Report Icon */}
      <Link href="/report">
        <button
          className="fixed bottom-20 right-4 z-50 p-2 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          title="Report a Scam"
        >
          <Flag className="w-5 h-5" />
        </button>
      </Link>

      <div className="flex-1 w-full max-w-screen-sm mx-auto p-4 mt-4 space-y-6">
        <h1 className="text-2xl font-bold text-center pb-4">Recent Scams</h1>

        {loading && (
          <div className="text-center mt-10">
            <Loader />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center mt-4">Error: {error}</p>
        )}

        {!loading && !error && scams.length === 0 && (
          <p className="text-center text-gray-500">No scams reported yet.</p>
        )}

        {!loading &&
          !error &&
          scams.map((scam) => (
            <div
              key={scam.id}
              className="p-4 border border-[var(--input)] rounded-xl shadow-md bg-[var(--card)]"
            >
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {scam.title}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                {scam.description}
              </p>
              <p className="mt-2 text-sm">
                <strong>Category:</strong> {scam.category}
              </p>
              <p className="text-sm mt-1">
                Submitted by:{" "}
                {scam.submittedBy ? (
                  <Link
                    href={`/search/${scam.submittedBy}`}
                    className="text-blue-600 hover:underline"
                  >
                    This user
                  </Link>
                ) : (
                  "Unknown user"
                )}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Reported on:{" "}
                {new Date(scam.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

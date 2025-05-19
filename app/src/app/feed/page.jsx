"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
        setScams(data);
        console.log("Scams data:", data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <h1>Scam Reports Feed</h1>
      <Link href="/report">
        <button className="btn btn-primary">Report a Scam</button>
      </Link>
      {scams.length === 0 && <p>No scams reported yet.</p>}
      <ul>
        {scams.map((scam) => (
          <li key={scam.id} style={{ marginBottom: "20px" }}>
            <h3>{scam.title}</h3>
            <p>{scam.description}</p>
            <p>
              <strong>Category:</strong> {scam.category}
            </p>
            {scam.submittedBy ? (
              <p>
                Submitted by:{" "}
                <Link href={`/search/${scam.submittedBy}`}>This user</Link>
              </p>
            ) : (
              <p>Submitted by: Unknown user</p>
            )}
            <p>
              <small>
                Reported on: {new Date(scam.createdAt).toLocaleString()}
              </small>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}

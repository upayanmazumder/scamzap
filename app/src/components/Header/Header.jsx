"use client";

import { useEffect, useState } from "react";
import Authenticate from "../Auth/Authenticate/Authenticate";
import API from "../../utils/api";

export default function Header() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const res = await fetch(`${API}/ping`);
        setIsOnline(res.ok);
      } catch (err) {
        setIsOnline(false);
      }
    };

    checkAPI();
    const interval = setInterval(checkAPI, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-gray-800 text-white shadow-md">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-wide">Scamzap</h1>
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isOnline ? "API Online" : "API Offline"}
        </span>
      </div>
      <Authenticate />
    </header>
  );
}

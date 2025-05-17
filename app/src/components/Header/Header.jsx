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
    <header className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 bg-gray-800 text-white shadow-md w-full">
      <div
        className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto mb-2 sm:mb-0"
        style={{ margin: "0" }}
      >
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">Scamzap</h1>
        <span
          className={`text-xs sm:text-sm font-medium px-2 py-1 rounded ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isOnline ? "API Online" : "API Offline"}
        </span>
      </div>
      <div className="w-full sm:w-auto flex justify-end">
        <Authenticate />
      </div>
    </header>
  );
}

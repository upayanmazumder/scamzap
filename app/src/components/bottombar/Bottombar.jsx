"use client";

import React from "react";
import Link from "next/link";
import { Home, Search, User, Settings } from "lucide-react";

export const BottomBar = () => {
  return (
    <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-[var(--background)] border border-[var(--input)] bottom-0 left-1/2 lg:w-16 lg:h-[88vh] lg:top-1/2 lg:left-4 lg:translate-y-[-50%] lg:rounded-none lg:border-0 lg:flex lg:flex-col lg:justify-between lg:items-center lg:mx-5">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto lg:grid-cols-1 lg:max-w-none lg:w-full">
        <Link
          href="/"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-full group lg:rounded-none lg:px-2 lg:py-5"
        >
          <Home className={`w-6 h-6 `} />
          <span className="sr-only">Home</span>
        </Link>

        <Link
          href="/search"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-full group lg:rounded-none lg:px-2 lg:py-5"
        >
          <Search className={`w-6 h-6 }`} />
          <span className="sr-only">Search</span>
        </Link>

        <Link
          href="/profile"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-full group lg:rounded-none lg:px-2 lg:py-5"
        >
          <User className={`w-6 h-6 `} />
          <span className="sr-only">Profile</span>
        </Link>

        <Link
          href="/settings"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-full group lg:rounded-none lg:px-2 lg:py-5"
        >
          <Settings className={`w-6 h-6 `} />
          <span className="sr-only">Settings</span>
        </Link>
      </div>
    </div>
  );
};

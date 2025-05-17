"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Search, User, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const BottomBar = () => {
  return (
    <div
      className="fixed z-50 w-full h-16 max-w-lg bg-[var(--background)] border border-[var(--input)] bottom-0 left-1/2 
  lg:w-48 lg:h-screen lg:top-0 lg:left-0 lg:translate-y-0 lg:rounded-none lg:flex 
  lg:flex-col lg:justify-start lg:items-start lg:py-4 lg:px-3"
    >
      <div className="hidden lg:flex items-center justify-center mb-6 w-full">
        <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
        <h1
          className="text-2xl font-bold text-center"
          style={{ color: "var(--foreground)", fontSize: "1.5rem" }}
        >
          Scamzap
        </h1>
      </div>

      <div className="grid h-full max-w-lg grid-cols-4 mx-auto lg:grid-cols-1 lg:max-w-none lg:w-full lg:gap-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex flex-col items-center justify-center px-5 py-1 rounded-s-full group lg:rounded-md lg:flex-row lg:justify-start lg:px-3 lg:py-2 hover:bg-muted transition"
          >
            <Icon className="w-6 h-6" style={{ color: "var(--foreground)" }} />

            <span
              className="sr-only lg:not-sr-only lg:ml-3 lg:text-sm"
              style={{ color: "var(--foreground)" }}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

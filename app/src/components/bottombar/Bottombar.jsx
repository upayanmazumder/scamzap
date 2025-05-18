"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, User, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const BottomBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="
        fixed z-50 w-full h-16 max-w-lg bg-[var(--background)] px-2 py-2
        bottom-0 left-1/2 -translate-x-1/2
        border-t-2 border-[var(--input)]
        lg:top-0 lg:left-0 lg:h-screen lg:w-56 lg:max-w-none lg:translate-x-0 lg:translate-y-0
        lg:flex lg:flex-col lg:items-start lg:justify-start lg:rounded-none lg:py-4 lg:px-3
        lg:border-t-0 lg:border-r-2
      "
    >
      <div className="hidden lg:flex items-center justify-start gap-2 mb-6 w-full">
        <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
        <h1
          className="text-2xl font-bold text-[var(--foreground)]"
          style={{ margin: 0 }}
        >
          Scamzap
        </h1>
      </div>

      <div className="grid w-full h-full grid-cols-4 lg:grid-cols-1 lg:gap-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            (href === "/" &&
              (pathname === "/" || pathname.startsWith("/learn"))) ||
            pathname === href;

          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`
        appearance-none bg-transparent border-none outline-none
        group inline-flex items-center justify-center p-2 rounded-md transition
        flex-col lg:flex-row lg:justify-center lg:items-center lg:w-full
        hover:!text-[var(--theme-red)] hover:bg-muted
        ${
          isActive
            ? "!text-[var(--theme-orange)]"
            : "!text-[var(--theme-yellow)]"
        }
      `}
              style={{ backgroundColor: "transparent", boxShadow: "none" }}
            >
              <Icon className="w-6 h-6" />
              <span className="sr-only lg:not-sr-only lg:ml-3 lg:text-sm">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, User, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingMascot } from "../floatingmascot/FloatingMascot";

const navItems = [
  { href: "/learn", label: "Learn", icon: Home },
  { href: "/feed", label: "Feed", icon: Bell },
  { href: "/search", label: "Search", icon: Search },
  { href: "/profile", label: "Profile", icon: User },
];

export const BottomBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") {
    return null;
  }

  if (pathname.startsWith("/learn/")) {
    return (
      <div
        className="
        hidden lg:fixed lg:z-50 lg:top-0 lg:left-0 lg:h-screen lg:w-[21rem] 
        lg:flex lg:items-center lg:justify-center
      "
      >
        <FloatingMascot />
      </div>
    );
  }

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
      <div
        className="hidden lg:flex items-center justify-center gap-2 mb-6 mr-0 w-full"
        style={{ margin: 0 }}
      >
        <a
          href="https://github.com/upayanmazumder/scamzap"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
          <h1
            className="text-xl font-bold text-[var(--foreground)]"
            style={{ margin: 0, fontSize: "1.5em" }}
          >
            Scamzap
          </h1>
        </a>
      </div>

      <div className="grid w-full h-full grid-cols-4 lg:grid-cols-1 lg:gap-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/learn")
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <motion.button
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
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-md bg-[var(--input)] opacity-20 z-[-1]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              <Icon className="w-6 h-6" />
              <span className="sr-only lg:not-sr-only lg:ml-3 lg:text-sm">
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

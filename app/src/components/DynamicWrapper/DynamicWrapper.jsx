"use client";

import { usePathname } from "next/navigation";

export default function DynamicWrapper({ children }) {
  const pathname = usePathname();
  let bool = true;

  if (pathname === "/" || pathname.startsWith("/learn/")) {
    bool = false;
  }

  return <div className={bool ? "lg:ml-[7rem]" : ""}>{children}</div>;
}
